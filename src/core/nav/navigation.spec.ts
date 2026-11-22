import { getCurrentPageLabel, getSectionLinks, isActiveFor } from "@core/nav/navigation"
import { TOP_NAV } from "@core/nav/paths"
import { describe, expect, it } from "vite-plus/test"

describe("navigation", () => {
    it("labels the home path", () => {
        expect(getCurrentPageLabel("/")).toBe("~/portfolio")
    })

    it("labels the cv path with or without trailing slash", () => {
        expect(getCurrentPageLabel("/cv")).toBe("~/cv")
        expect(getCurrentPageLabel("/cv/")).toBe("~/cv")
    })

    it("falls back to the root label for any other path", () => {
        expect(getCurrentPageLabel("/logs/some-post")).toBe("~/")
        expect(getCurrentPageLabel("/search")).toBe("~/")
        expect(getCurrentPageLabel("")).toBe("~/portfolio")
    })

    it("marks exactly one route active", () => {
        for (const [pathname, expected] of [
            ["/", "~/portfolio"],
            ["/cv", "~/cv"],
            ["/logs/post", "~/logs"],
        ] as const) {
            const active = TOP_NAV.filter((def) => isActiveFor(def, pathname))
            expect(active).toHaveLength(1)
            expect(active[0]?.label).toBe(expected)
        }
    })

    it("returns cv section links on cv", () => {
        const links = getSectionLinks("/cv")
        expect(links.map((link) => link.href)).toEqual([
            "/cv#experience",
            "/cv#skills",
            "/cv#projects",
            "/cv#education",
        ])
    })

    it("returns home section links on home", () => {
        const links = getSectionLinks("/")
        expect(links.map((link) => link.href)).toEqual(["/#story", "/#logs", "/#contact"])
    })

    it("returns uses section links on uses", () => {
        const links = getSectionLinks("/uses")
        expect(links.map((link) => link.href)).toEqual([
            "/uses#workspace",
            "/uses#development",
            "/uses#ai-agents",
            "/uses#exploring",
        ])
    })

    it("returns no section links elsewhere", () => {
        expect(getSectionLinks("/logs")).toEqual([])
    })
})
