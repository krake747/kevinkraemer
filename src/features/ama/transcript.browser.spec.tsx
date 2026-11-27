import { AmaTranscript, type AmaEntry } from "@features/ama/transcript"
import { renderToContainer } from "@testing/render"
import { describe, expect, it } from "vite-plus/test"

const ready: AmaEntry = {
    id: 1,
    question: "What stack powers this site?",
    status: "ready",
    answer: {
        sources: [{ path: "/about", title: "About", description: "The story so far." }],
        summary: "Kevin automates the boring parts first.",
    },
}

function mounted(entries: AmaEntry[], onRetry: (id: number) => void = () => {}): HTMLElement {
    return renderToContainer(() => <AmaTranscript entries={entries} pending={false} onRetry={onRetry} />)
}

describe("the ama transcript", () => {
    it("invites a first question when empty", () => {
        expect(mounted([]).textContent).toContain("Ask anything about the site.")
    })

    it("shows the answer with its source", () => {
        const text = mounted([ready]).textContent
        expect(text).toContain("Kevin automates the boring parts first.")
        expect(text).toContain("About")
    })

    it("names the failed question with the reason", () => {
        const failed: AmaEntry = { id: 2, question: "zzz", status: "failed", detail: "No published page answers this." }
        expect(mounted([failed]).textContent).toContain("No published page answers this.")
    })

    it("offers retry on a ready answer", () => {
        expect(mounted([ready]).textContent).toContain("retry")
    })

    it("copies a ready answer", () => {
        expect(mounted([ready]).textContent).toContain("copy")
    })

    it("offers no copy on a failed answer", () => {
        const failed: AmaEntry = { id: 2, question: "zzz", status: "failed", detail: "No published page answers this." }
        expect(mounted([failed]).textContent).not.toContain("copy")
    })

    it("retries only the chosen entry", () => {
        const seen: number[] = []
        const root = mounted([ready], (id) => {
            seen.push(id)
        })
        const retry = [...root.querySelectorAll("button")].find((button) => button.textContent === "retry")
        retry?.click()
        expect(seen).toEqual([1])
    })
})
