import { debounce } from "@solid-primitives/scheduled"
import { createSignal } from "solid-js"

export function createDebouncedInput(options: { commit: (value: string) => void; wait: number; source: () => string }) {
    const [input, setInput] = createSignal(() => options.source())
    const commitDebounced = debounce((value: string) => options.commit(value.trim()), options.wait)
    const update = (next: string) => {
        setInput(next)
        commitDebounced(next)
    }
    const reset = () => {
        commitDebounced.clear()
        setInput("")
    }
    return { input, update, reset }
}
