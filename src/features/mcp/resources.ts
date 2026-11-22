import type { TapePrint } from "@core/ask/tape"
import { canonicalFor } from "@core/site/urls"

export type McpResource = Pick<TapePrint, "title" | "description"> & {
    name: string
    uri: string
    mimeType: "text/markdown"
}

export type McpResourceText = Pick<McpResource, "uri" | "mimeType"> & {
    text: string
}

function resourceBody(page: TapePrint): string {
    return `# ${page.title}\n\n${page.description}\n\n${page.content}\n\nCanonical: ${canonicalFor(page.path)}\n`
}

export function listResources(prints: TapePrint[]): McpResource[] {
    return prints.map((page) => {
        return {
            name: page.path,
            uri: canonicalFor(page.path),
            title: page.title,
            description: page.description,
            mimeType: "text/markdown",
        }
    })
}

export function readResource(prints: TapePrint[], uri: string): McpResourceText | undefined {
    const page = prints.find((candidate) => {
        return canonicalFor(candidate.path) === uri
    })
    if (page === undefined) {
        return undefined
    }
    return { uri, mimeType: "text/markdown", text: resourceBody(page) }
}
