import type { LogEntry } from "@core/content/model"

const graphBlock = /^:::graph-flow(?:\{[^}]*\})?[ \t]*\r?\n[\s\S]*?^:::[ \t]*$/gm
const fenceLine = /^[ \t]*(?:```|~~~)/
const codeSpan = /(`+[^`]*`+)/
const rootLink = /\]\((\/[^)\s]*)\)/g

export function logEntryMarkdown(entry: LogEntry, base: string): string {
    const origin = base.replace(/\/+$/, "")
    const frontmatter = [
        "---",
        `title: ${JSON.stringify(entry.title)}`,
        `description: ${JSON.stringify(entry.description)}`,
        `date: ${entry.date.slice(0, 10)}`,
        `tags: ${JSON.stringify(entry.tags)}`,
        `canonical: ${origin}/logs/${entry.id}`,
        "---",
    ].join("\n")
    return `${frontmatter}\n\n${absolutizeLinks(stripGraphDirectives(entry.body), origin)}\n`
}

export function stripGraphDirectives(markdown: string): string {
    return markdown
        .replace(graphBlock, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim()
}

export function absolutizeLinks(markdown: string, base: string): string {
    const origin = base.replace(/\/+$/, "")
    let inFence = false
    return markdown
        .split("\n")
        .map((line) => {
            if (fenceLine.test(line)) {
                inFence = !inFence
                return line
            }
            if (inFence) {
                return line
            }
            return line
                .split(codeSpan)
                .map((segment, index) => (index % 2 === 0 ? absolutizeSegment(segment, origin) : segment))
                .join("")
        })
        .join("\n")
}

function absolutizeSegment(segment: string, origin: string): string {
    return segment.replace(rootLink, (_, target: string) => `](${origin}${target})`)
}
