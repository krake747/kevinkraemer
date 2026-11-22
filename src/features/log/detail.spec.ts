import { resolveLogDetail } from "@features/log/detail"
import { makeLogEntry } from "@testing/log-entry"
import { describe, expect, it } from "vite-plus/test"

const entries = [
    makeLogEntry("oldest", { date: "2026-01-01", tags: ["solid"] }),
    makeLogEntry("middle", { date: "2026-02-01", tags: ["solid", "types"] }),
    makeLogEntry("newest", { date: "2026-03-01", tags: ["types"] }),
    makeLogEntry("unrelated", { date: "2026-04-01", tags: ["markets"] }),
]

describe("a log entry page", () => {
    it("surfaces the entry the slug names", () => {
        expect(resolveLogDetail(entries, "middle")?.entry.id).toBe("middle")
    })

    it("puts the next-older entry behind and the next-newer ahead", () => {
        const detail = resolveLogDetail(entries, "middle")
        expect(detail?.older?.id).toBe("oldest")
        expect(detail?.newer?.id).toBe("newest")
    })

    it("has no neighbours at either end of the stream", () => {
        expect(resolveLogDetail(entries, "oldest")?.older).toBeUndefined()
        expect(resolveLogDetail(entries, "unrelated")?.newer).toBeUndefined()
    })

    it("lists related entries by shared tag, newest first, capped at three", () => {
        const detail = resolveLogDetail(entries, "middle")
        expect(detail?.related.map((entry) => entry.id)).toEqual(["newest", "oldest"])
    })

    it("resolves nothing for a missing or absent slug", () => {
        for (const slug of ["missing", undefined]) {
            expect(resolveLogDetail(entries, slug)).toBeUndefined()
        }
    })
})
