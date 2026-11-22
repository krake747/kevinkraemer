import { readdirSync } from "node:fs"
import { join } from "node:path"

import { test, expect } from "@playwright/test"

const ORIGIN = "https://www.kevinkraemer.com"

function authoredEntries(): string[] {
    return readdirSync(join("dist/client", "logs"))
        .filter((name) => name.endsWith(".md"))
        .map((name) => name.slice(0, -".md".length))
        .toSorted()
}

const entries = authoredEntries()

test("every log entry ships an authored markdown file", () => {
    expect(entries.length).toBeGreaterThan(0)
})

for (const id of entries) {
    test(`/logs/${id}.md is the authored file, not a conversion`, async ({ request }) => {
        const response = await request.get(`/logs/${id}.md`)

        expect(response.status()).toBe(200)
        expect(response.headers()["content-type"]).toContain("text/markdown")
        expect(response.headers().vary).toContain("Accept")

        const markdown = await response.text()
        expect(markdown.startsWith("---\ntitle: ")).toBe(true)
        expect(markdown).toContain(`canonical: ${ORIGIN}/logs/${id}`)
        expect(markdown).toContain("\ndate: ")
        expect(markdown).not.toContain(":::graph-flow")
        expect(markdown).not.toContain("<p>")
    })

    test(`/logs/${id} advertises its markdown alternate`, async ({ request }) => {
        const html = await (await request.get(`/logs/${id}`)).text()

        expect(html).toMatch(
            new RegExp(`<link[^>]+rel="alternate"[^>]+type="text/markdown"[^>]+href="${ORIGIN}/logs/${id}\\.md"`),
        )
    })
}

test("pages without an authored file still convert on request", async ({ request }) => {
    const response = await request.get("/about.md")

    expect(response.status()).toBe(200)
    expect(response.headers()["content-type"]).toContain("text/markdown")
    await expect(response.text()).resolves.toContain("financial risk analyst")
})
