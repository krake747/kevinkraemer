import { formatLogDateLong, formatLogDateShort } from "@core/content/log-date"
import { describe, expect, it } from "vite-plus/test"

describe("log dates", () => {
    it.each([
        ["2025-04-28T00:00:00.000Z", "April 28, 2025"],
        ["2025-01-01T00:00:00.000Z", "January 1, 2025"],
        ["2024-02-29T12:00:00.000Z", "February 29, 2024"],
        ["2025-12-31T23:59:59.000Z", "December 31, 2025"],
        ["2025-04-28T23:00:00.000Z", "April 28, 2025"],
    ] as const)("formats %s without shifting across timezones → %s", (input, expected) => {
        expect(formatLogDateLong(input)).toBe(expected)
    })

    it("formats short variant", () => {
        expect(formatLogDateShort("2025-04-28T00:00:00.000Z")).toBe("Apr 28, 2025")
        expect(formatLogDateShort(new Date("2025-04-28T00:00:00.000Z"))).toBe("Apr 28, 2025")
    })
})
