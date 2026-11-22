import { readFileSync } from "node:fs"

import { describe, expect, it } from "vite-plus/test"

function robots(): string {
    return readFileSync("public/robots.txt", "utf8")
}

function blockFor(agent: string): string {
    const pattern = new RegExp(`User-agent: ${agent}\\n((?:.+\\n)+?)(?=\\nUser-agent:|\\n#|$)`, "m")
    const block = pattern.exec(robots())?.[1] ?? ""
    expect(block.length, `expected a robots.txt block for ${agent}`).toBeGreaterThan(0)
    return block
}

describe("robots.txt agent policy", () => {
    it("allows retrieval agents probed by readiness graders", () => {
        for (const agent of ["ChatGPT-User", "ClaudeBot", "Claude-User", "PerplexityBot", "OAI-SearchBot"]) {
            const block = blockFor(agent)
            expect(block).toContain("Allow: /")
            expect(block).not.toContain("Disallow")
        }
    })

    it("keeps pure training crawlers disallowed (EU Art.4 TDM opt-out)", () => {
        for (const agent of ["GPTBot", "CCBot", "Google-Extended", "Bytespider"]) {
            expect(blockFor(agent)).toContain("Disallow: /")
        }
    })

    it("points at the sitemap", () => {
        expect(robots()).toContain("Sitemap: https://www.kevinkraemer.com/sitemap-index.xml")
    })
})
