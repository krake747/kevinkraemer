import { isNonEmpty, mapToNonEmpty } from "@core/non-empty"
import { describe, expect, it } from "vite-plus/test"

describe("non-empty lists", () => {
    it("narrows populated lists", () => {
        expect(isNonEmpty(["a"])).toBe(true)
        expect(isNonEmpty([])).toBe(false)
    })

    it("maps to a non-empty list", () => {
        expect(mapToNonEmpty(["a", "b"], (entry) => entry.toUpperCase(), "entries")).toEqual(["A", "B"])
    })

    it("throws loudly when nothing remains", () => {
        expect(() => mapToNonEmpty([], (entry) => entry, "entries")).toThrow("entries is empty")
    })
})
