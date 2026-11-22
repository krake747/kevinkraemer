import type { LogEntry } from "@core/content/model"
import {
    logIdFromPath,
    logPagePath,
    parseSearchInput,
    searchLogEntries,
    webMcpTools,
    type Navigate,
} from "@features/webmcp/tools"
import * as v from "valibot"
import { describe, expect, it } from "vite-plus/test"

const navigate: Navigate = () => undefined

const tagVocabularySchema = v.object({
    properties: v.object({ tags: v.object({ items: v.object({ enum: v.array(v.string()) }) }) }),
})

const limitSchema = v.object({
    properties: v.object({ limit: v.object({ type: v.string(), minimum: v.number(), maximum: v.number() }) }),
})

function entry(id: string, title: string, description: string, tags: string[], date: string): LogEntry {
    return { id, title, description, tags, date, body: "", html: "", graphs: [], toc: [] }
}

const entries = [
    entry(
        "kept-small",
        "Keep the context small",
        "An index of pointers beats one big file.",
        ["agents"],
        "2026-08-30T00:00:00.000Z",
    ),
    entry(
        "process",
        "Software Changed",
        "Processes still run the old chain.",
        ["agents", "craft"],
        "2026-09-06T00:00:00.000Z",
    ),
    entry(
        "omarchy",
        "Leaving Windows",
        "Moving the daily work to Linux.",
        ["craft", "tools"],
        "2026-11-15T00:00:00.000Z",
    ),
]

describe("search input", () => {
    it("treats a missing input as an open query", () => {
        expect(parseSearchInput(undefined)).toEqual({ query: "", tags: [], limit: 10 })
    })

    it("clamps the limit to the documented range", () => {
        expect(parseSearchInput({ limit: 0 }).limit).toBe(1)
        expect(parseSearchInput({ limit: 999 }).limit).toBe(50)
        expect(parseSearchInput({ limit: 4.7 }).limit).toBe(4)
    })

    it("ignores values of the wrong type", () => {
        expect(parseSearchInput({ query: 7, tags: "agents", limit: "many" })).toEqual({
            query: "",
            tags: [],
            limit: 10,
        })
    })
})

describe("search results", () => {
    it("matches words in the title or description, case aside", () => {
        const { total, results } = searchLogEntries(entries, { query: "PROCESSES" })

        expect(total).toBe(1)
        expect(results.map((result) => result.id)).toEqual(["process"])
    })

    it("matches any of the requested tags", () => {
        const { results } = searchLogEntries(entries, { tags: ["tools", "craft"] })

        expect(results.map((result) => result.id)).toEqual(["process", "omarchy"])
    })

    it("returns the total before the limit slices", () => {
        const { total, results } = searchLogEntries(entries, { limit: 1 })

        expect(total).toBe(3)
        expect(results).toHaveLength(1)
    })

    it("hands back the canonical and markdown URLs for each hit", () => {
        const [first] = searchLogEntries(entries, { query: "context" }).results

        expect(first?.markdownUrl).toBe("/logs/kept-small.md")
        expect(first?.url).toBe("https://www.kevinkraemer.com/logs/kept-small")
        expect(first?.date).toBe("2026-08-30")
    })
})

describe("page paths", () => {
    it("parses a log entry id from a path", () => {
        expect(logIdFromPath("/logs/kept-small")).toBe("kept-small")
        expect(logIdFromPath("/logs/kept-small/")).toBe("kept-small")
        expect(logIdFromPath("/logs")).toBeUndefined()
        expect(logIdFromPath("/projects/kevinkraemer-com")).toBeUndefined()
    })

    it("builds the requested page", () => {
        expect(logPagePath({ page: "logs" })).toBe("/logs")
        expect(logPagePath({ page: "log", id: "kept-small" })).toBe("/logs/kept-small")
        expect(logPagePath({ page: "cv" })).toBe("/cv")
    })

    it("refuses a log page without a usable id", () => {
        expect(() => logPagePath({ page: "log" })).toThrow('The "log" page needs the id of a log entry.')
        expect(() => logPagePath({ page: "log", id: "../secrets" })).toThrow(
            'The "log" page needs the id of a log entry.',
        )
        expect(() => logPagePath({ page: "search" })).toThrow("The page must be one of")
    })
})

describe("tool surface", () => {
    it("declares three tools with unique names", () => {
        const tools = webMcpTools(entries, navigate)

        expect(tools.map((tool) => tool.name)).toEqual(["search_logs", "read_log", "open_page"])
        expect(new Set(tools.map((tool) => tool.name)).size).toBe(tools.length)
    })

    it("marks navigation as a visible action and reads as read-only", () => {
        const readOnly = webMcpTools(entries, navigate)
            .filter((tool) => tool.annotations?.readOnlyHint === true)
            .map((tool) => tool.name)

        expect(readOnly).toEqual(["search_logs", "read_log"])
    })

    it("takes the tag vocabulary from the content", () => {
        const search = webMcpTools(entries, navigate).find((tool) => tool.name === "search_logs")

        expect(v.parse(tagVocabularySchema, search?.inputSchema).properties.tags.items.enum).toEqual([
            "agents",
            "craft",
            "tools",
        ])
    })

    it("advertises the limit range the parser clamps to", () => {
        const search = webMcpTools(entries, navigate).find((tool) => tool.name === "search_logs")

        expect(v.parse(limitSchema, search?.inputSchema).properties.limit).toMatchObject({
            type: "integer",
            minimum: 1,
            maximum: 50,
        })
    })
})
