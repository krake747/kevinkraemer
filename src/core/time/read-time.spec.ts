import { formatWordCount, getReadTime, getWordCount } from "@core/time/read-time"
import { describe, it, expect } from "vite-plus/test"

describe("word counts", () => {
    it.each([
        [undefined, 0],
        ["", 0],
        ["   ", 0],
        ["hello", 1],
        ["hello world", 2],
        ["  hello   world  ", 2],
        ["a b c d e", 5],
        ["line\nbreak\ttab", 3],
    ] as const)("getWordCount(%j) -> %i", (input, expected) => {
        expect(getWordCount(input)).toBe(expected)
    })

    it("splits on whitespace variant", () => {
        expect(getWordCount("one  two\tthree\nfour")).toBe(4)
    })
})

describe("formatted word counts", () => {
    it.each([
        [undefined, "0"],
        ["", "0"],
        ["hello world", "2"],
        ["a ".repeat(1000), "1,000"],
        ["a ".repeat(1234567), "1,234,567"],
    ] as const)("formatWordCount(%j) -> %s", (input, expected) => {
        expect(formatWordCount(input)).toBe(expected)
    })
})

describe("read time", () => {
    it.each([
        [undefined, "0 min read"],
        ["", "0 min read"],
        ["word", "1 min read"],
        ["a ".repeat(199), "1 min read"],
        ["a ".repeat(200), "1 min read"],
        ["a ".repeat(201), "2 min read"],
        ["a ".repeat(400), "2 min read"],
        ["a ".repeat(401), "3 min read"],
    ] as const)("getReadTime %j -> %s", (input, expected) => {
        expect(getReadTime(input)).toBe(expected)
    })
})
