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

describe("the ama transcript", () => {
    it("invites a first question when empty", () => {
        expect(renderToContainer(() => <AmaTranscript entries={[]} />).textContent).toContain(
            "Ask anything about the site.",
        )
    })

    it("shows the answer with its source", () => {
        const text = renderToContainer(() => <AmaTranscript entries={[ready]} />).textContent
        expect(text).toContain("Kevin automates the boring parts first.")
        expect(text).toContain("About")
    })

    it("names the failed question with the reason", () => {
        const failed: AmaEntry = { id: 2, question: "zzz", status: "failed", detail: "No published page answers this." }
        expect(renderToContainer(() => <AmaTranscript entries={[failed]} />).textContent).toContain(
            "No published page answers this.",
        )
    })
})
