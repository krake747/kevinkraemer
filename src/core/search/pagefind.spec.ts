import { stripHtml, toSearchHit, toSearchOutcome } from "@core/search/pagefind"
import { describe, expect, it } from "vite-plus/test"

describe("excerpt stripping", () => {
    it.each([
        ["<p>Hello <strong>world</strong></p>", "Hello world"],
        ["no tags", "no tags"],
        ["", ""],
        ["<div><span>nested <em>tags</em></span></div>", "nested tags"],
        ["<p></p>", ""],
        ["<a href='/x'>link</a> and text", "link and text"],
    ] as const)("strips %s → %s", (input, expected) => {
        expect(stripHtml(input)).toBe(expected)
    })
})

describe("search hits", () => {
    it("maps meta title and strips excerpt", () => {
        const hit = toSearchHit({ url: "/logs/a", excerpt: "<p>Excerpt</p>", meta: { title: "A" } })
        expect(hit).toEqual({ title: "A", excerpt: "Excerpt", href: "/logs/a" })
    })

    it("falls back to url when title missing", () => {
        expect(toSearchHit({ url: "/logs/a", excerpt: "Excerpt" }).title).toBe("/logs/a")
        expect(toSearchHit({ url: "/logs/a", excerpt: "Excerpt", meta: {} }).title).toBe("/logs/a")
    })

    it("strips html from excerpt", () => {
        const hit = toSearchHit({
            url: "/logs/a",
            excerpt: "<p>Hello <strong>world</strong></p>",
            meta: { title: "A" },
        })
        expect(hit.excerpt).toBe("Hello world")
        expect(hit.href).toBe("/logs/a")
    })

    it("drops the file extension pagefind reports for prerendered routes", () => {
        expect(toSearchHit({ url: "/cv.html", excerpt: "", meta: { title: "CV" } }).href).toBe("/cv")
        expect(toSearchHit({ url: "/logs/a.html", excerpt: "", meta: { title: "A" } }).href).toBe("/logs/a")
    })

    it("drops the trailing slash pagefind reports for directory routes", () => {
        expect(toSearchHit({ url: "/cv/", excerpt: "", meta: { title: "CV" } }).href).toBe("/cv")
        expect(toSearchHit({ url: "/logs/a/", excerpt: "", meta: { title: "A" } }).href).toBe("/logs/a")
    })

    it("keeps the root route and bare paths intact", () => {
        expect(toSearchHit({ url: "/", excerpt: "", meta: { title: "Home" } }).href).toBe("/")
        expect(toSearchHit({ url: "/index.html", excerpt: "", meta: { title: "Home" } }).href).toBe("/")
        expect(toSearchHit({ url: "/logs", excerpt: "", meta: { title: "Logs" } }).href).toBe("/logs")
    })
})

describe("pagefind results", () => {
    it("turns a promised payload into hits", () => {
        const outcome = toSearchOutcome([{ url: "/logs/a", excerpt: "<p>A</p>" }], 3)

        expect(outcome).toEqual({ kind: "hits", hits: [{ title: "/logs/a", excerpt: "A", href: "/logs/a" }], total: 3 })
    })

    it("reports an unavailable search when the payload breaks the contract", () => {
        expect(toSearchOutcome([{ url: 42, excerpt: "A" }], 1)).toEqual({
            kind: "failure",
            failure: "unavailable",
        })
    })
})
