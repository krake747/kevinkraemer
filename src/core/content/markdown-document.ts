import type { LogEntry } from "@core/content/model"

const graphBlock = /^:::graph-flow(?:\{[^}]*\})?[ \t]*\r?\n[\s\S]*?^:::[ \t]*$/gm
const fenceLine = /^[ \t]*(?:```|~~~)/
const codeSpan = /(`+[^`]*`+)/
const rootLink = /\]\((\/[^)\s]*)\)/g

export function logEntryMarkdown(entry: LogEntry, base: string): string {
    const origin = base.replace(/\/+$/, "")
    const frontmatter = `---\ntitle: ${JSON.stringify(entry.title)}\ndescription: ${JSON.stringify(entry.description)}\ndate: ${entry.date.slice(0, 10)}\ntags: ${JSON.stringify(entry.tags)}\ncanonical: ${origin}/logs/${entry.id}\n---`
    return `${frontmatter}\n\n${absolutizeLinks(stripGraphDirectives(entry.body), origin)}\n`
}

export function stripGraphDirectives(markdown: string): string {
    return markdown
        .replace(graphBlock, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim()
}

type FenceState = { inFence: boolean; out: string[] }

function absolutizeLine(line: string, origin: string): string {
    return line
        .split(codeSpan)
        .map((segment, index) => (index % 2 === 0 ? absolutizeSegment(segment, origin) : segment))
        .join("")
}

function stepLine(origin: string): (state: FenceState, line: string) => FenceState {
    return (state, line) => {
        if (fenceLine.test(line)) {
            return { inFence: !state.inFence, out: [...state.out, line] }
        }
        if (state.inFence) {
            return { inFence: state.inFence, out: [...state.out, line] }
        }
        return { inFence: state.inFence, out: [...state.out, absolutizeLine(line, origin)] }
    }
}

export function absolutizeLinks(markdown: string, base: string): string {
    const origin = base.replace(/\/+$/, "")
    const { out } = markdown.split("\n").reduce<FenceState>(stepLine(origin), { inFence: false, out: [] })
    return out.join("\n")
}

function absolutizeSegment(segment: string, origin: string): string {
    return segment.replace(rootLink, (_, target: string) => `](${origin}${target})`)
}
