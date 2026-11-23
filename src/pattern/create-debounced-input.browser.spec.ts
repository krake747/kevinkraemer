import { createDebouncedInput } from "@pattern/create-debounced-input"
import { createRoot, createSignal, flush } from "solid-js"
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test"

vi.mock("@solid-primitives/scheduled", () => ({
    debounce: (callback: (value: string) => void, wait: number) => {
        let timeoutId: ReturnType<typeof setTimeout> | undefined
        const clear = () => clearTimeout(timeoutId)
        const debounced = (value: string) => {
            clear()
            timeoutId = setTimeout(() => callback(value), wait)
        }
        return Object.assign(debounced, { clear })
    },
}))

const WAIT = 300

const mount = (commit = vi.fn<(value: string) => void>(), source: () => string = () => "") =>
    createRoot((dispose) => ({ ...createDebouncedInput({ commit, wait: WAIT, source }), commit, dispose }))

beforeEach(() => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] })
})

afterEach(() => {
    vi.useRealTimers()
})

describe("debounced input", () => {
    it("shows typing immediately, commits trimmed after the wait", () => {
        const { input, update, commit, dispose } = mount()
        update(" hello ")
        flush()
        expect(input()).toBe(" hello ")
        expect(commit).not.toHaveBeenCalled()
        vi.advanceTimersByTime(WAIT)
        expect(commit).toHaveBeenCalledTimes(1)
        expect(commit).toHaveBeenCalledWith("hello")
        dispose()
    })

    it("keeps only the newest keystroke", () => {
        const { update, commit, dispose } = mount()
        update("a")
        vi.advanceTimersByTime(WAIT - 100)
        update("ab")
        vi.advanceTimersByTime(WAIT)
        expect(commit).toHaveBeenCalledTimes(1)
        expect(commit).toHaveBeenCalledWith("ab")
        dispose()
    })

    it("reset drops the pending commit and clears the input", () => {
        const { input, update, reset, commit, dispose } = mount()
        update("a")
        reset()
        flush()
        vi.advanceTimersByTime(WAIT)
        expect(commit).not.toHaveBeenCalled()
        expect(input()).toBe("")
        dispose()
    })

    it("starts from the source value", () => {
        const { input, commit, dispose } = mount(vi.fn(), () => "q")
        expect(input()).toBe("q")
        expect(commit).not.toHaveBeenCalled()
        dispose()
    })

    it("follows the source after the first read and keeps a local edit until then", () => {
        const session = createRoot((dispose) => {
            const [source, setSource] = createSignal("")
            const commit = vi.fn<(value: string) => void>()
            return { ...createDebouncedInput({ commit, wait: WAIT, source }), setSource, commit, dispose }
        })
        expect(session.input()).toBe("")
        session.setSource("solid")
        flush()
        expect(session.input()).toBe("solid")
        session.update("solidity")
        flush()
        expect(session.input()).toBe("solidity")
        session.setSource("router")
        flush()
        expect(session.input()).toBe("router")
        expect(session.commit).not.toHaveBeenCalled()
        session.dispose()
    })
})
