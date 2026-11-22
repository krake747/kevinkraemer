import { CONFIRM_RESET_MS, createCopyFeedback } from "@pattern/create-copy-feedback"
import { createRoot, flush } from "solid-js"
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test"

const writeText = vi.fn<(text: string) => Promise<void>>()

const mount = () => createRoot((dispose) => ({ feedback: createCopyFeedback(), dispose }))

const announcer = () => document.querySelector('[data-ui-sdk-announcer=""]')?.textContent

beforeEach(() => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] })
    writeText.mockReset()
    writeText.mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } })
})

afterEach(() => {
    vi.useRealTimers()
    Reflect.deleteProperty(navigator, "clipboard")
    document.body.replaceChildren()
})

describe("copy feedback", () => {
    it("starts at rest", () => {
        const { feedback, dispose } = mount()
        expect(feedback.copyLabel()).toBe("copy")
        dispose()
    })

    it("copies the text and marks the label copied", async () => {
        const { feedback, dispose } = mount()
        const outcome = await feedback.copy("kevin")

        expect(outcome).toEqual({ kind: "copied" })
        expect(writeText).toHaveBeenCalledWith("kevin")
        expect(feedback.copyLabel()).toBe("copied")
        dispose()
    })

    it("returns the label to rest after the visible duration", async () => {
        const { feedback, dispose } = mount()
        await feedback.copy("kevin")

        vi.advanceTimersByTime(CONFIRM_RESET_MS - 1)
        expect(feedback.copyLabel()).toBe("copied")

        vi.advanceTimersByTime(1)
        flush()
        expect(feedback.copyLabel()).toBe("copy")
        dispose()
    })

    it("restarts the visible duration when copied again", async () => {
        const { feedback, dispose } = mount()
        await feedback.copy("first")
        vi.advanceTimersByTime(CONFIRM_RESET_MS - 100)
        await feedback.copy("second")

        vi.advanceTimersByTime(CONFIRM_RESET_MS - 100)
        expect(feedback.copyLabel()).toBe("copied")

        vi.advanceTimersByTime(100)
        flush()
        expect(feedback.copyLabel()).toBe("copy")
        dispose()
    })

    it("reports a rejected write as failed", async () => {
        writeText.mockRejectedValueOnce(new Error("denied"))
        const { feedback, dispose } = mount()
        const outcome = await feedback.copy("kevin")

        expect(outcome).toEqual({ kind: "failed" })
        expect(feedback.copyLabel()).toBe("failed")
        dispose()
    })

    it("reports an unavailable clipboard as failed", async () => {
        Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined })
        const { feedback, dispose } = mount()
        const outcome = await feedback.copy("kevin")

        expect(outcome).toEqual({ kind: "failed" })
        dispose()
    })

    it("keeps the newest write's state when an older one settles late", async () => {
        const older = Promise.withResolvers<void>()
        writeText.mockReturnValueOnce(older.promise)
        const { feedback, dispose } = mount()

        const stale = feedback.copy("older")
        const outcome = await feedback.copy("newer")
        older.reject(new Error("denied"))

        expect(await stale).toEqual({ kind: "failed" })
        expect(outcome).toEqual({ kind: "copied" })
        expect(feedback.copyLabel()).toBe("copied")
        dispose()
    })

    it("announces the copy, then the failure", async () => {
        const { feedback, dispose } = mount()
        await feedback.copy("kevin")
        vi.advanceTimersByTime(1000)
        expect(announcer()).toBe("Copied")

        writeText.mockRejectedValueOnce(new Error("denied"))
        await feedback.copy("kevin")
        vi.advanceTimersByTime(1000)
        expect(announcer()).toBe("Copy failed")
        dispose()
    })
})
