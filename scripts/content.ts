import { execSync } from "node:child_process"
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

import GithubSlugger from "github-slugger"
import { defineHastPlugin, defineMdastPlugin, markdownToHtml } from "satteri"
import * as v from "valibot"
import { parse as parseYaml } from "yaml"

import type { GraphFlowSpec, LogTocEntry, Project } from "../src/core/content/model.ts"
import { prerenderPaths } from "../src/core/site/prerender-paths.ts"
import { isFlowName, type FlowName } from "../src/features/log/flows.ts"

const CONTENT = fileURLToPath(new URL("../content", import.meta.url))
const OUT = fileURLToPath(new URL("../src/generated/content.ts", import.meta.url))

import {
    AboutSchema,
    CONTENT_BUNDLE_VERSION,
    ExperienceSchema,
    LogEntrySchema,
    ProjectSchema,
    UsesSchema,
} from "../src/core/content/content-intake.ts"

function parseFlow(value: string, file: string): FlowName {
    if (isFlowName(value)) {
        return value
    }
    throw new Error(`${file}: unknown graph flow "${value}"`)
}

function parseFrontmatter(raw: string, file: string): unknown {
    const parsed = parseYaml(raw)
    if (typeof parsed !== "object" || parsed === null) {
        throw new Error(`${file}: frontmatter is not a mapping`)
    }
    return parsed
}

function validate<T>(schema: v.GenericSchema<unknown, T>, value: unknown, file: string): T {
    const result = v.safeParse(schema, value)
    if (!result.success) {
        throw new Error(`${file}: ${v.summarize(result.issues)}`)
    }
    return result.output
}

function readFiles(dir: string, extension: string): Promise<string[]> {
    return readdir(join(CONTENT, dir)).then((files) => files.filter((file) => file.endsWith(extension)))
}

function renderMarkdown(
    source: string,
    file: string,
): { html: string; graphs: GraphFlowSpec[]; toc: LogTocEntry[]; frontmatter: string } {
    const graphs: GraphFlowSpec[] = []
    const toc: LogTocEntry[] = []
    const slugger = new GithubSlugger()

    const result = markdownToHtml(source, {
        features: { gfm: true, directive: true, math: true, headingAttributes: true, smartPunctuation: true },
        mdastPlugins: [
            defineMdastPlugin({
                name: "graph-flow",
                containerDirective(node, ctx) {
                    if (node.name !== "graph-flow") {
                        return
                    }
                    const attributes = node.attributes ?? {}
                    const title = attributes.title ?? "CHAIN"
                    const flow = parseFlow(attributes.flow ?? "chain", file)
                    const compare = attributes.compare ?? undefined
                    const third = attributes.third ?? undefined
                    const index = graphs.length
                    if (compare === undefined) {
                        graphs.push({ kind: "single", title, flow })
                    } else {
                        graphs.push({
                            kind: "compare",
                            title,
                            flow,
                            compare: parseFlow(compare, file),
                            ...(third === undefined ? {} : { third: parseFlow(third, file) }),
                        })
                    }
                    ctx.replaceNode(node, { type: "html", value: `<div data-graph-slot="${index}"></div>` })
                },
            }),
        ],
        hastPlugins: [
            defineHastPlugin({
                name: "heading-ids",
                element: {
                    filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
                    visit(node, ctx) {
                        const text = ctx.textContent(node)
                        const id = slugger.slug(text)
                        ctx.setProperty(node, "id", id)
                        if (node.tagName === "h2") {
                            const trimmed = text.trim()
                            if (trimmed.length > 0) {
                                toc.push({ id, text: trimmed })
                            }
                        }
                    },
                },
            }),
        ],
    })

    const frontmatter = result.frontmatter
    if (frontmatter === null) {
        throw new Error("markdown document has no frontmatter")
    }
    return { html: result.html, graphs, toc, frontmatter: frontmatter.value }
}

function extractBody(source: string, file: string): string {
    const match = /^---\r?\n[\s\S]*?\r?\n---\r?\n?/.exec(source)
    if (match === null) {
        throw new Error(`${file}: missing frontmatter delimiters`)
    }
    return source.slice(match[0].length).trim()
}

async function loadMarkdown<T extends object>(dir: string, schema: v.GenericSchema<unknown, T>) {
    const files = await readFiles(dir, ".md")
    const entries = []

    for (const file of files.toSorted()) {
        const source = await readFile(join(CONTENT, dir, file), "utf8")
        const rendered = renderMarkdown(source, file)
        const data = validate(schema, parseFrontmatter(rendered.frontmatter, file), file)
        entries.push({
            id: file.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.md$/, ""),
            body: extractBody(source, file),
            html: rendered.html,
            graphs: rendered.graphs,
            toc: rendered.toc,
            data,
        })
    }

    return entries
}

async function loadLogs() {
    const entries = await loadMarkdown("logs", LogEntrySchema)
    return entries.map(({ id, body, html, graphs, toc, data }) => ({
        id,
        title: data.title,
        description: data.description,
        date: new Date(data.date).toISOString(),
        tags: data.tags,
        body,
        html,
        graphs,
        toc,
    }))
}

async function loadAbout() {
    const entries = await loadMarkdown("about", AboutSchema)
    return entries.map(({ id, html, graphs, data }) => ({
        id,
        title: data.title,
        order: data.order,
        html,
        graphs,
    }))
}

async function loadJson<T>(dir: string, schema: v.GenericSchema<unknown, T>) {
    const files = await readFiles(dir, ".json")
    const entries = []

    for (const file of files) {
        const source = await readFile(join(CONTENT, dir, file), "utf8")
        const data = validate(schema, JSON.parse(source), file)
        entries.push({ id: file.replace(/\.json$/, ""), ...data })
    }

    return entries
}

async function loadProjects() {
    const entries = await loadMarkdown("projects", ProjectSchema)
    return entries.map(({ id, html, graphs, data }) => ({
        id,
        ...data,
        html,
        graphs,
    }))
}

const REPO_ROOT = fileURLToPath(new URL("..", import.meta.url))

function readUsesUpdated(): string {
    const override = process.env.USES_UPDATED?.trim()
    if (override !== undefined && override !== "") {
        return override
    }
    const isoDate = execSync('git log -1 --format="%ci" -- content/uses', {
        encoding: "utf-8",
        cwd: REPO_ROOT,
    }).trim()
    const dateOnly = isoDate.split(" ")[0] ?? ""
    return dateOnly === "" ? new Date().toISOString().slice(0, 10) : dateOnly
}

function readCvUpdated(): string {
    const override = process.env.CV_UPDATED?.trim()
    if (override !== undefined && override !== "") {
        return override
    }
    const isoDate = execSync('git log -1 --format="%ci" -- src/features/cv/', {
        encoding: "utf-8",
        cwd: REPO_ROOT,
    }).trim()
    const dateOnly = isoDate.split(" ")[0] ?? ""
    const [year, month, day] = dateOnly.split("-")
    if (year === undefined || month === undefined || day === undefined) {
        throw new Error("unexpected git date format for CV updated stamp")
    }
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const monthName = months[Number.parseInt(month, 10) - 1]
    if (monthName === undefined) {
        throw new Error("unexpected git month for CV updated stamp")
    }
    return `${monthName} ${day}, ${year}`
}

const logs = await loadLogs()
const rawProjects = await loadProjects()
const routeCount = String(prerenderPaths({ logs, projects: rawProjects }).length)
const projects: Project[] = rawProjects.map((project) => {
    const figure = project.figure
    if (figure === undefined || figure.source !== "prerender-routes") {
        return { ...project, figure }
    }
    return { ...project, figure: { ...figure, value: routeCount } }
})

const content = {
    meta: {
        version: CONTENT_BUNDLE_VERSION,
        cvUpdated: readCvUpdated(),
        usesUpdated: readUsesUpdated(),
        buildDate: new Date().toISOString().slice(0, 10),
        buildYear: new Date().getFullYear(),
    },
    logs,
    about: await loadAbout(),
    experience: await loadJson("experience", ExperienceSchema),
    uses: await loadJson("uses", UsesSchema),
    projects,
}

await mkdir(fileURLToPath(new URL("../src/generated/", import.meta.url)), { recursive: true })
await writeFile(
    OUT,
    `import type { ContentBundle } from "@core/content/model"\n\nexport const content = ${JSON.stringify(content, null, 4)} satisfies ContentBundle\n`,
)
console.log(
    `content: ${content.logs.length} log entries, ${content.about.length} about, ${content.experience.length} experience, ${content.uses.length} uses, ${content.projects.length} projects`,
)
