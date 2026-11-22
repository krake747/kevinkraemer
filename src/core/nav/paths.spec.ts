import { isHomePath, isCvPath, isLogsPath } from "@core/nav/paths"
import { describe, it, expect } from "vite-plus/test"

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
