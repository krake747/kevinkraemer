import { createHash } from "node:crypto"
import { readdirSync, readFileSync, statSync } from "node:fs"
import { mkdir, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

import { buildTape, TAPE_VERSION } from "@core/ask/tape"
import { catalogEntries } from "@core/site/catalog"
import { site } from "@core/site/site-meta"

const root = fileURLToPath(new URL("../", import.meta.url))
const outputPath = join(root, "src/generated/tape.ts")

const sourceRoots = [
    "content",
    "src/core/site/catalog.ts",
    "src/core/site/endpoints.ts",
    "src/core/site/site-meta.ts",
    "src/features/command-palette/palette-commands.ts",
]

function walkFiles(target: string): string[] {
    const absolute = join(root, target)
    const stat = statSync(absolute, { throwIfNoEntry: false })
    if (stat === undefined) {
        return []
    }
    if (stat.isFile()) {
        return [target]
    }
    const found: string[] = []
    for (const entry of readdirSync(absolute, { withFileTypes: true })) {
        const child = join(target, entry.name)
        if (entry.isDirectory()) {
            found.push(...walkFiles(child))
        } else if (entry.isFile()) {
            found.push(child)
        }
    }
    return found
}

function sourceHash(): string {
    const files = sourceRoots.flatMap((source) => walkFiles(source))
    files.sort()
    const hash = createHash("sha256")
    for (const file of files) {
        hash.update(file)
        hash.update(readFileSync(join(root, file)))
    }
    return hash.digest("hex")
}

function readMarkdownBody(file: string): string {
    const raw = readFileSync(join(root, file), "utf8")
    return raw.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, "").trim()
}

function joinMarkdown(files: string[]): string {
    return files
        .map((file) => {
            const slug = file.split("/").at(-1)?.replace(/\.md$/, "") ?? file
            return `# ${slug}\n\n${readMarkdownBody(file)}`
        })
        .join("\n\n---\n\n")
}

function joinData(files: string[]): string {
    return files.map((file) => readFileSync(join(root, file), "utf8").trim()).join("\n\n")
}

const staticContent: Record<string, string> = {
    "/contact": `Email: ${site.email}. GitHub: github.com/krake747. LinkedIn: linkedin.com/in/kevin-kraemer-5b1a0583/.
Based in Luxembourg (CET), replies in about two business days, open to roles and collaborations.`,
    "/privacy": `No analytics, no tracking, no cookies. The site is static output served by Netlify, which records request logs.
localStorage stores only the theme preference (light or dark). No personal data is collected or sold.`,
    "/developers": `Machine-readable endpoints: llms.txt (site index), llms-full.txt (every log entry), openapi.json (OpenAPI),
.well-known/api-catalog (RFC 9264 linkset), rss.xml, sitemap. Every page also serves markdown for Accept: text/markdown
and a typed JSON descriptor for Accept: application/json.`,
}

function contentFor(path: string): string {
    if (path === "/logs") {
        return joinMarkdown(
            walkFiles("content/logs")
                .filter((file) => file.endsWith(".md"))
                .toSorted()
                .toReversed(),
        )
    }
    if (path === "/about") {
        return joinMarkdown(
            ["intro.md", "current-role.md", "philosophy.md", "elsewhere.md"].map((name) => `content/about/${name}`),
        )
    }
    if (path === "/cv") {
        return joinData(
            walkFiles("content/experience")
                .filter((file) => file.endsWith(".json"))
                .toSorted(),
        )
    }
    const staticHit = staticContent[path]
    if (staticHit !== undefined) {
        return staticHit
    }
    if (path === "/uses") {
        return joinData(
            walkFiles("content/uses")
                .filter((file) => file.endsWith(".json"))
                .toSorted(),
        )
    }
    return ""
}

const prints = buildTape(contentFor)(catalogEntries)

await mkdir(fileURLToPath(new URL("../src/generated/", import.meta.url)), { recursive: true })
await writeFile(
    outputPath,
    `import type { TapeFile } from "@core/ask/tape"\n\nexport const tape = ${JSON.stringify(
        { version: TAPE_VERSION, sourceHash: sourceHash(), prints },
        null,
        4,
    )} satisfies TapeFile\n`,
)
console.log(`tape: ${prints.length} prints`)
