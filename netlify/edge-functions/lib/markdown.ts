import Turndown from "turndown"
import { gfm } from "turndown-plugin-gfm"

import { cleanHtml } from "../../../src/core/content/html.ts"

const turndown = new Turndown({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
    emDelimiter: "*",
})

turndown.use(gfm)

export function htmlToMarkdown(html: string): string {
    return turndown.turndown(cleanHtml(html))
}
