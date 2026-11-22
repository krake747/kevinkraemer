import {
    filterLogEntries,
    findById,
    getAllTags,
    getRecentLogEntries,
    getRelatedLogEntries,
    sortLogEntries,
} from "@core/content/model"
import { makeLogEntry as makeEntry } from "@testing/log-entry"
import { describe, expect, it } from "vite-plus/test"

describe("log ordering", () => {
    it("lists the newest entry first", () => {
        const entries = [
            makeEntry("a", { date: "2026-01-01" }),
            makeEntry("b", { date: "2026-03-01" }),
            makeEntry("c", { date: "2026-02-01" }),
        ]
        expect(sortLogEntries(entries).map((entry) => entry.id)).toEqual(["b", "c", "a"])
    })
})

describe("recent log entries", () => {
    it("keeps only the newest entries, newest first", () => {
        const entries = [
            makeEntry("a", { date: "2026-01-01" }),
            makeEntry("b", { date: "2026-03-01" }),
            makeEntry("c", { date: "2026-02-01" }),
        ]
        expect(getRecentLogEntries(entries, 2).map((entry) => entry.id)).toEqual(["b", "c"])
    })
})

describe("the tag list", () => {
    it("lists each tag once, alphabetically", () => {
        const entries = [
            makeEntry("a", { date: "2026-01-01", tags: ["b", "a"] }),
            makeEntry("b", { date: "2026-01-02", tags: ["a", "c"] }),
        ]
        expect(getAllTags(entries)).toEqual(["a", "b", "c"])
    })
})

describe("related log entries", () => {
    it("lists entries that share a tag, nearest first, without the current entry", () => {
        const entries = [
            makeEntry("a", { date: "2026-01-01", tags: ["x"] }),
            makeEntry("b", { date: "2026-01-02", tags: ["x", "y"] }),
            makeEntry("c", { date: "2026-01-03", tags: ["y"] }),
            makeEntry("d", { date: "2026-01-04", tags: ["z"] }),
        ]
        expect(getRelatedLogEntries(entries, "a", ["x"], 2).map((entry) => entry.id)).toEqual(["b"])
        expect(getRelatedLogEntries(entries, "x", ["y"], 10).map((entry) => entry.id)).toEqual(["c", "b"])
    })
})

describe("log filtering", () => {
    const entries = [
        makeEntry("solid-guide", { date: "2026-01-01", tags: ["solid"], title: "Solid guide" }),
        makeEntry("rust-notes", { date: "2026-01-02", tags: ["rust"], title: "Rust notes" }),
    ]

    it("shows every entry when nothing is filtered", () => {
        expect(filterLogEntries(entries, [], "").map((entry) => entry.id)).toEqual(["solid-guide", "rust-notes"])
    })

    it("narrows to the selected tag", () => {
        expect(filterLogEntries(entries, ["rust"], "").map((entry) => entry.id)).toEqual(["rust-notes"])
    })

    it("narrows to the search query", () => {
        expect(filterLogEntries(entries, [], "solid").map((entry) => entry.id)).toEqual(["solid-guide"])
    })

    it("requires a match on both tag and query when both are set", () => {
        expect(filterLogEntries(entries, ["solid"], "rust").map((entry) => entry.id)).toEqual([])
        expect(filterLogEntries(entries, ["solid"], "guide").map((entry) => entry.id)).toEqual(["solid-guide"])
    })
})

describe("finding an entry by id", () => {
    const entries = [makeEntry("a", { date: "2026-01-01" }), makeEntry("b", { date: "2026-01-02" })]

    it("surfaces the matching entry", () => {
        expect(findById(entries, "b")?.id).toBe("b")
    })

    it("resolves nothing for a missing or absent id", () => {
        expect(findById(entries, "zzz")).toBeUndefined()
        expect(findById(entries, undefined)).toBeUndefined()
    })
})
