import { toLogSummaries } from "@features/log/summaries"
import { makeLogEntry } from "@testing/log-entry"
import { describe, expect, it } from "vite-plus/test"

function entry(body: string) {
    return makeLogEntry("my-entry", {
        title: "A considered title",
        description: "A description of adequate length",
        date: "2026-08-23",
        tags: ["solid"],
        body,
        html: "<p>body text</p>",
    })
}

describe("log summaries", () => {
    it("derives read time from the body at 200 words per minute", () => {
        const filler = Array.from({ length: 400 }, (_, index) => `word${index}`).join(" ")
        const [result] = toLogSummaries([entry(filler)])
        expect(result?.readTime).toBe("2 min read")
    })
})
