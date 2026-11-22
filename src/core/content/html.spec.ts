import { cleanHtml } from "@core/content/html"
import { describe, expect, it } from "vite-plus/test"

describe("HTML cleaning", () => {
    it("removes head, script, style, noscript, chrome", () => {
        const html = `
            <head><title>Hidden</title></head>
            <script>evil()</script>
            <style>body{}</style>
            <noscript>nojs</noscript>
            <header>Header</header>
            <nav>Nav</nav>
            <main><h1>Keep</h1></main>
            <footer>Footer</footer>
            <!-- comment -->
            <span class="lambda select-none">-</span>
            <span>|</span>
        `
        const cleaned = cleanHtml(html)
        expect(cleaned).not.toContain("Hidden")
        expect(cleaned).not.toContain("evil()")
        expect(cleaned).not.toContain("nojs")
        expect(cleaned).not.toContain("Header")
        expect(cleaned).not.toContain("Nav")
        expect(cleaned).not.toContain("Footer")
        expect(cleaned).not.toContain("lambda")
        expect(cleaned).not.toContain("<!--")
        expect(cleaned).toContain("Keep")
    })

    it("keeps content and collapses excess newlines", () => {
        const cleaned = cleanHtml("<p>a</p>\n\n\n\n<p>b</p>")
        expect(cleaned).not.toContain("\n\n\n")
        expect(cleaned).toContain("a")
        expect(cleaned).toContain("b")
    })

    it("removes pipe spans with whitespace", () => {
        expect(cleanHtml("<span> | </span><span>keep</span>")).not.toContain("|")
        expect(cleanHtml("<span> | </span>")).not.toContain("|")
    })
})
