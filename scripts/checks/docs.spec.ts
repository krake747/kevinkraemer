import { describe, expect, it } from "vite-plus/test"

import { findEmDashes } from "./docs.mjs"

describe("docs em dash check", () => {
    it("reports one em dash with line and column", () => {
        expect(findEmDashes("one — two")).toEqual([{ line: 1, column: 5 }])
    })

    it("reports two em dashes on one line", () => {
        expect(findEmDashes("a — b — c")).toEqual([
            { line: 1, column: 3 },
            { line: 1, column: 7 },
        ])
    })

    it("ignores en dashes and hyphens", () => {
        expect(findEmDashes("a – b - c")).toEqual([])
    })

    it("reports empty string as clean", () => {
        expect(findEmDashes("")).toEqual([])
    })
})
