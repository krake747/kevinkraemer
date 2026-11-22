import { describe, expect, it } from "vite-plus/test"

import { htmlToMarkdown } from "./markdown.ts"

describe("HTML to Markdown", () => {
    it("converts content and removes site chrome", () => {
        const markdown = htmlToMarkdown(`
            <head><title>Hidden</title></head>
            <header>Header</header>
            <nav>Navigation</nav>
            <main><h1>Visible title</h1><p>A <a href="/link">useful link</a>.</p></main>
            <footer>Footer</footer>
        `)

        expect(markdown).toContain("# Visible title")
        expect(markdown).toContain("[useful link](/link)")
        expect(markdown).not.toContain("Header")
        expect(markdown).not.toContain("Navigation")
        expect(markdown).not.toContain("Footer")
        expect(markdown).not.toContain("Hidden")
    })
})
