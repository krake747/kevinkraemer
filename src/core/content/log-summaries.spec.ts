import { toLogSummaries } from "@core/content/log-summaries"
import type { LogEntry } from "@core/content/model"
import { describe, expect, it } from "vite-plus/test"

function entry(overrides: Partial<LogEntry> = {}): LogEntry {
    return {
        id: "my-entry",
        title: "A considered title",
        description: "A description of adequate length",
        date: "2026-08-23",
        tags: ["solid"],
        body: "body text",
        html: "<p>body text</p>",
        graphs: [],
        ...overrides,
    }
}

describe("log summaries", () => {
    it("derives read time from the body at 200 words per minute", () => {
        const filler = Array.from({ length: 400 }, (_, index) => `word${index}`).join(" ")
        const [result] = toLogSummaries([entry({ body: filler })])
        expect(result?.readTime).toBe("2 min read")
    })
})
