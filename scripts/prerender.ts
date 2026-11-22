import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import { handleRequest } from "../dist/server/server.js"
import { logEntryMarkdown } from "../src/core/content/markdown-document.ts"
import { prerenderPaths } from "../src/core/site/prerender-paths.ts"
import { content } from "../src/generated/content.ts"

const ORIGIN = "https://www.kevinkraemer.com"
const OUT = fileURLToPath(new URL("../dist/client", import.meta.url))
const STYLESHEET = /<link rel="stylesheet" href="([^"]+)">/g

const sheets = new Map<string, string>()

async function stylesheet(href: string): Promise<string> {
    const cached = sheets.get(href)
    if (cached !== undefined) {
        return cached
    }
    const css = await readFile(join(OUT, href), "utf8")
    sheets.set(href, css)
    return css
}

async function inlineStyles(html: string): Promise<string> {
    const hrefs = [...new Set([...html.matchAll(STYLESHEET)].map((match) => match[1]))]
    let out = html
    for (const href of hrefs) {
        out = out.replaceAll(`<link rel="stylesheet" href="${href}">`, `<style>${await stylesheet(href)}</style>`)
    }
    return out
}

const paths = prerenderPaths(content)

async function prerender(path: string, file: string, expectedStatus: number): Promise<void> {
    const response = await handleRequest(new Request(new URL(path, ORIGIN)))
    if (response.status !== expectedStatus) {
        const body = await response.text()
        throw new Error(`prerender ${path}: expected ${expectedStatus}, got ${response.status} (${body.slice(0, 200)})`)
    }
    const target = join(OUT, file)
    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, await inlineStyles(await response.text()))
    console.log(`prerender ${path} -> ${file}`)
}

for (const path of paths) {
    await prerender(path, path === "/" ? "index.html" : `${path.slice(1)}.html`, 200)
}

await prerender("/404", "404.html", 404)

for (const entry of content.logs) {
    const file = `logs/${entry.id}.md`
    const target = join(OUT, file)
    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, logEntryMarkdown(entry, ORIGIN))
    console.log(`prerender markdown -> ${file}`)
}

const artifacts = [
    ["/openapi.json", "openapi.json"],
    ["/rss.xml", "rss.xml"],
    ["/llms-full.txt", "llms-full.txt"],
    ["/sitemap-index.xml", "sitemap-index.xml"],
    ["/sitemap-0.xml", "sitemap-0.xml"],
] as const

for (const [path, file] of artifacts) {
    await prerender(path, file, 200)
}
