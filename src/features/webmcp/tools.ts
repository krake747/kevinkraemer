import { filterLogEntries, findById, getAllTags, type LogEntry } from "@core/content/model"
import { canonicalFor } from "@core/site/urls"
import { toJsonSchema, type JsonSchema } from "@valibot/to-json-schema"
import * as v from "valibot"

export type Navigate = (path: string) => void | Promise<void>

export type WebMcpTool = {
    name: string
    title: string
    description: string
    inputSchema: JsonSchema
    annotations?: { readOnlyHint?: boolean }
    execute: (input: unknown) => Promise<unknown>
}

export type LogSearchResult = Pick<LogEntry, "id" | "title" | "description" | "tags"> & {
    date: string
    url: string
    markdownUrl: string
}

const slugPattern = /^[a-z0-9-]+$/
const logPath = /^\/logs\/([a-z0-9-]+)\/?$/
const defaultLimit = 10
const maxLimit = 50

const searchInputSchema = v.object({
    query: v.optional(
        v.pipe(
            v.string(),
            v.description("Words that must appear in a title or description. Leave it empty to list everything."),
        ),
        "",
    ),
    tags: v.optional(
        v.pipe(v.array(v.string()), v.description('Topic filters, such as "agents" or "craft". Any match counts.')),
        [],
    ),
    limit: v.optional(
        v.pipe(
            v.number(),
            v.integer(),
            v.minValue(1),
            v.maxValue(maxLimit),
            v.description(`Maximum results, defaults to ${defaultLimit}, capped at ${maxLimit}.`),
        ),
        defaultLimit,
    ),
})

const readLogInputSchema = v.object({
    id: v.optional(v.pipe(v.string(), v.description("The id of the entry, as returned by search_logs."))),
})

const logPathByPage = new Map([
    ["home", "/"],
    ["logs", "/logs"],
    ["log", "/logs"],
    ["cv", "/cv"],
    ["about", "/about"],
    ["projects", "/projects"],
    ["contact", "/contact"],
])

const pageNames = [...logPathByPage.keys()]

const openPageInputSchema = v.object({
    page: v.pipe(v.picklist(pageNames), v.description("The page to open.")),
    id: v.optional(v.pipe(v.string(), v.description('The log entry id, required when the page is "log".'))),
})

export type LogSearchInput = v.InferOutput<typeof searchInputSchema>

const emptySearchInput: LogSearchInput = v.parse(searchInputSchema, {})
const searchInputJsonSchema = toJsonSchema(searchInputSchema)
const readLogInputJsonSchema = toJsonSchema(readLogInputSchema)
const openPageInputJsonSchema = toJsonSchema(openPageInputSchema)

function textField(input: unknown, name: string): string | undefined {
    const value = fieldOf(input, name)
    return typeof value === "string" ? value : undefined
}

function fieldOf(input: unknown, name: string): unknown {
    return hasField(input, name) ? input[name] : undefined
}

function clampedLimit(value: unknown): unknown {
    if (typeof value !== "number" || !Number.isFinite(value)) {
        return value
    }
    return Math.min(Math.max(Math.trunc(value), 1), maxLimit)
}

export function parseSearchInput(value: unknown): LogSearchInput {
    const candidate = isInput(value)
        ? {
              query: fieldOf(value, "query"),
              tags: fieldOf(value, "tags"),
              limit: clampedLimit(fieldOf(value, "limit")),
          }
        : value
    const parsed = v.safeParse(v.optional(searchInputSchema, emptySearchInput), candidate)
    return parsed.success ? { ...parsed.output, query: parsed.output.query.trim() } : emptySearchInput
}

export function searchLogEntries(
    entries: readonly LogEntry[],
    value: unknown,
): {
    total: number
    results: LogSearchResult[]
} {
    const input = parseSearchInput(value)
    const matches = filterLogEntries(entries, input.tags, input.query)
    return {
        total: matches.length,
        results: matches.slice(0, input.limit).map(toSearchResult),
    }
}

export function logIdFromPath(pathname: string): string | undefined {
    return logPath.exec(pathname)?.[1]
}

function logEntryPath(value: unknown): string {
    const id = textField(value, "id")
    if (id === undefined || !slugPattern.test(id)) {
        throw new Error('The "log" page needs the id of a log entry.')
    }
    return `/logs/${id}`
}

function staticPagePath(page: string | undefined): string {
    const path = page === undefined ? undefined : logPathByPage.get(page)
    if (path === undefined) {
        throw new Error(`The page must be one of ${pageNames.map((name) => `"${name}"`).join(", ")}.`)
    }
    return path
}

export function logPagePath(value: unknown): string {
    const page = textField(value, "page")
    if (page === "log") {
        return logEntryPath(value)
    }
    return staticPagePath(page)
}

export function webMcpTools(entries: readonly LogEntry[], navigate: Navigate): WebMcpTool[] {
    return [
        {
            name: "search_logs",
            title: "Search log entries",
            description:
                "Search Kevin Kraemer's log entries about software architecture, type systems, finance, and developer tooling. Returns the newest matches with their canonical URL and a Markdown URL to read.",
            inputSchema: withTagEnum(searchInputJsonSchema, getAllTags(entries)),
            annotations: { readOnlyHint: true },
            execute: async (input) => searchLogEntries(entries, input),
        },
        {
            name: "read_log",
            title: "Read a log entry",
            description:
                "Read a log entry as the authored Markdown, including YAML front matter. Omit the id to read the entry that is currently open.",
            inputSchema: readLogInputJsonSchema,
            annotations: { readOnlyHint: true },
            execute: async (input) => readLogEntry(entries, input),
        },
        {
            name: "open_page",
            title: "Open a page",
            description:
                "Open a page of the site in the browser: the home page, the log index, one log entry, the CV, about, projects, or contact.",
            inputSchema: openPageInputJsonSchema,
            annotations: { readOnlyHint: false },
            execute: async (input) => {
                const path = logPagePath(input)
                await navigate(path)
                return { path }
            },
        },
    ]
}

function withTagEnum(schema: JsonSchema, tags: readonly string[]): JsonSchema {
    const tagSchema = schema.properties?.["tags"]
    if (tagSchema === undefined || typeof tagSchema === "boolean") {
        return schema
    }
    const items = tagSchema.items
    if (items === undefined || typeof items === "boolean" || Array.isArray(items)) {
        return schema
    }
    return {
        ...schema,
        properties: {
            ...schema.properties,
            tags: { ...tagSchema, items: { ...items, enum: [...tags] } },
        },
    }
}

async function readLogEntry(entries: readonly LogEntry[], value: unknown) {
    const parsed = v.safeParse(readLogInputSchema, value)
    const requested = parsed.success ? parsed.output.id : undefined
    const id = requested ?? (typeof location === "undefined" ? undefined : logIdFromPath(location.pathname))
    if (id === undefined || !slugPattern.test(id)) {
        throw new Error("No log entry is open, pass the id of an entry as returned by search_logs.")
    }
    const entry = findById(entries, id)
    if (entry === undefined) {
        throw new Error(`There is no log entry with the id "${id}".`)
    }
    const markdownUrl = `/logs/${entry.id}.md`
    const response = await fetch(markdownUrl)
    if (!response.ok) {
        throw new Error(`Failed to read "${id}" (${response.status}).`)
    }
    return {
        id: entry.id,
        title: entry.title,
        url: canonicalFor(`/logs/${entry.id}`),
        markdownUrl,
        markdown: await response.text(),
    }
}

function toSearchResult(entry: LogEntry): LogSearchResult {
    return {
        id: entry.id,
        title: entry.title,
        description: entry.description,
        date: entry.date.slice(0, 10),
        tags: entry.tags,
        url: canonicalFor(`/logs/${entry.id}`),
        markdownUrl: `/logs/${entry.id}.md`,
    }
}

function isInput(value: unknown): value is object {
    return typeof value === "object" && value !== null
}

type FieldMap<K extends string> = { [P in K]: unknown }

function hasField<K extends string>(input: unknown, name: K): input is FieldMap<K> {
    return isInput(input) && name in input
}
