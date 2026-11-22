import { absolutizeLinks, logEntryMarkdown, stripGraphDirectives } from "@core/content/markdown-document"
import type { LogEntry } from "@core/content/model"
import { describe, expect, it } from "vite-plus/test"

const entry: LogEntry = {
    id: "something-visible",
    title: 'On "Visible" Things',
    description: "A note: about what stays hidden.",
    date: "2026-08-23T00:00:00.000Z",
    tags: ["site", "craft"],
    body: "First paragraph.\n\nSecond paragraph.",
    html: "<p>First paragraph.</p>",
    graphs: [],
}

describe("log entry markdown", () => {
    it("opens with front matter an agent can parse without the page", () => {
        const markdown = logEntryMarkdown(entry, "https://www.kevinkraemer.com")
        const [delimiter, ...lines] = markdown.split("\n")

        expect(delimiter).toBe("---")
        expect(lines).toContain('title: "On \\"Visible\\" Things"')
        expect(lines).toContain('description: "A note: about what stays hidden."')
        expect(lines).toContain("date: 2026-08-23")
        expect(lines).toContain('tags: ["site","craft"]')
        expect(lines).toContain("canonical: https://www.kevinkraemer.com/logs/something-visible")
    })

    it("keeps the authored body verbatim after the front matter", () => {
        const markdown = logEntryMarkdown(entry, "https://www.kevinkraemer.com")

        expect(markdown.endsWith("First paragraph.\n\nSecond paragraph.\n")).toBe(true)
    })

    it("normalizes a base with a trailing slash", () => {
        const markdown = logEntryMarkdown(entry, "https://www.kevinkraemer.com/")

        expect(markdown).toContain("canonical: https://www.kevinkraemer.com/logs/something-visible")
    })
})

describe("graph directives", () => {
    it("drops the visual directive that has no markdown form", () => {
        const body = 'Before.\n\n:::graph-flow{title="CHAIN" flow="chain"}\n:::\n\nAfter.'

        expect(stripGraphDirectives(body)).toBe("Before.\n\nAfter.")
    })

    it("leaves prose containers alone", () => {
        const body = ":::note\nKeep me.\n:::"

        expect(stripGraphDirectives(body)).toBe(body)
    })
})

describe("link absolutizing", () => {
    it("expands root-relative links against the origin", () => {
        const markdown = "Read [the CV](/cv) and [a log](/logs/something-visible#top)."

        expect(absolutizeLinks(markdown, "https://www.kevinkraemer.com")).toBe(
            "Read [the CV](https://www.kevinkraemer.com/cv) and [a log](https://www.kevinkraemer.com/logs/something-visible#top).",
        )
    })

    it("leaves external links and anchors alone", () => {
        const markdown = "[Site](https://angular.dev) and [top](#top)."

        expect(absolutizeLinks(markdown, "https://www.kevinkraemer.com")).toBe(markdown)
    })

    it("does not rewrite examples inside fenced code", () => {
        const markdown = "```md\n[CV](/cv)\n```\n\n[CV](/cv)"

        expect(absolutizeLinks(markdown, "https://www.kevinkraemer.com")).toBe(
            "```md\n[CV](/cv)\n```\n\n[CV](https://www.kevinkraemer.com/cv)",
        )
    })

    it("does not rewrite examples inside inline code", () => {
        const markdown = "Write `[CV](/cv)` to link. [CV](/cv)"

        expect(absolutizeLinks(markdown, "https://www.kevinkraemer.com")).toBe(
            "Write `[CV](/cv)` to link. [CV](https://www.kevinkraemer.com/cv)",
        )
    })
})
