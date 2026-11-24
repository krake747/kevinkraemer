import { announce } from "@ui-sdk/core"
import { createSignal, onCleanup, type Accessor } from "solid-js"

export const CONFIRM_RESET_MS = 1500

type CopyOutcome = { kind: "copied" } | { kind: "failed" }

type CopyStatus = "idle" | CopyOutcome["kind"]

type CopyFeedback = {
    copyLabel: Accessor<string>
    copy: (text: string) => Promise<CopyOutcome>
}

const LABEL = {
    idle: "copy",
    copied: "copied",
    failed: "failed",
} satisfies Record<CopyStatus, string>

const ANNOUNCEMENT = {
    copied: "Copied",
    failed: "Copy failed",
} satisfies Record<CopyOutcome["kind"], string>

export function createCopyFeedback(): CopyFeedback {
    const [status, setStatus] = createSignal<CopyStatus>("idle")
    let resetTimer: ReturnType<typeof setTimeout> | undefined
    let latestRequestId = 0

    onCleanup(() => clearTimeout(resetTimer))

    const copyLabel = () => LABEL[status()]

    const isCurrent = (id: number): boolean => {
        return id === latestRequestId
    }

    const settleCopy = (id: number, outcome: CopyOutcome): CopyOutcome => {
        if (!isCurrent(id)) {
            return outcome
        }
        setStatus(outcome.kind)
        announce(ANNOUNCEMENT[outcome.kind])
        clearTimeout(resetTimer)
        resetTimer = setTimeout(() => setStatus("idle"), CONFIRM_RESET_MS)
        return outcome
    }

    const copy = (text: string): Promise<CopyOutcome> => {
        const id = ++latestRequestId
        return Promise.resolve()
            .then(() => navigator.clipboard.writeText(text))
            .then(
                () => settleCopy(id, { kind: "copied" }),
                () => settleCopy(id, { kind: "failed" }),
            )
    }

    return { copyLabel, copy }
}
