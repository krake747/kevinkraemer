import { buildTape } from "@core/ask/tape"
import { describe, expect, it } from "vite-plus/test"

describe("the tape", () => {
    it("attaches resolved content to catalog entries", () => {
        const entries = [
            { path: "/cv", type: "text/html", rel: "related", title: "CV", description: "Career facts" },
            { path: "/logs", type: "text/html", rel: "related", title: "Logs", description: "Writing index" },
        ]
        expect(buildTape((path) => `${path} content`)(entries)).toEqual([
            { path: "/cv", title: "CV", description: "Career facts", content: "/cv content" },
            { path: "/logs", title: "Logs", description: "Writing index", content: "/logs content" },
        ])
    })

    it("falls back to the description when a page has no content source", () => {
        const entries = [
            { path: "/contact", type: "text/html", rel: "related", title: "Contact", description: "Contact channels" },
        ]
        expect(buildTape(() => "")(entries)).toEqual([
            { path: "/contact", title: "Contact", description: "Contact channels", content: "Contact channels" },
        ])
    })

    it("empty catalog yields empty tape", () => {
        expect(buildTape(() => "unreachable")([])).toEqual([])
    })
})
