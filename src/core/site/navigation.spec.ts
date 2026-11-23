import { getCurrentPageLabel, isActiveFor, isCvPath, isHomePath, isLogsPath, TOP_NAV } from "@core/site/navigation"
import { describe, expect, it } from "vite-plus/test"

describe("the home path", () => {
    it.each([
        ["/", true],
        ["", true],
        ["/cv", false],
        ["/logs", false],
        ["/about", false],
    ] as const)("isHomePath(%s) -> %s", (path, expected) => {
        expect(isHomePath(path)).toBe(expected)
    })
})

describe("the CV path", () => {
    it.each([
        ["/cv", true],
        ["/cv/", true],
        ["/cv#experience", true],
        ["/cv/foo", true],
        ["/", false],
        ["/cvs", false],
        ["/about", false],
    ] as const)("isCvPath(%s) -> %s", (path, expected) => {
        expect(isCvPath(path)).toBe(expected)
    })
})

describe("the logs path", () => {
    it.each([
        ["/logs", true],
        ["/logs/", true],
        ["/logs/post", true],
        ["/logistics", false],
        ["/", false],
    ] as const)("isLogsPath(%s) -> %s", (path, expected) => {
        expect(isLogsPath(path)).toBe(expected)
    })
})

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
})
