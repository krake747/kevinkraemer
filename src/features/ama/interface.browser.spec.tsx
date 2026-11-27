import { AmaInterface } from "@features/ama/interface"
import { createRouter, defineRoutes, memoryHistory } from "@solidjs/router"
import { renderToContainer } from "@testing/render"
import { describe, expect, it, vi } from "vite-plus/test"

const answer = {
    sources: [{ path: "/about", title: "About", description: "The story so far." }],
    summary: "Kevin automates the boring parts first.",
}

function jsonResponse(body: unknown, status: number): Response {
    return new Response(JSON.stringify(body), { status })
}

function mounted(): HTMLElement {
    const Router = createRouter({
        history: memoryHistory(),
        routes: defineRoutes([{ path: "/", component: () => <AmaInterface /> }]),
    })
    return renderToContainer(() => <Router />)
}

async function ask(root: HTMLElement, question: string): Promise<void> {
    const input = root.querySelector("input")
    const form = root.querySelector("form")
    if (input instanceof HTMLInputElement && form instanceof HTMLFormElement) {
        input.value = question
        input.dispatchEvent(new Event("input", { bubbles: true }))
        await flush()
        form.dispatchEvent(new SubmitEvent("submit", { bubbles: true, cancelable: true }))
    }
}

async function flush(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 0))
    await new Promise((resolve) => setTimeout(resolve, 0))
}

describe("the ama interface", () => {
    it("invites a first question when empty", () => {
        expect(mounted().textContent).toContain("Ask anything about the site.")
    })

    it("holds a second question while one is in flight", async () => {
        let resolveFetch!: (response: Response) => void
        vi.stubGlobal(
            "fetch",
            vi.fn(() => new Promise<Response>((resolve) => (resolveFetch = resolve))),
        )
        try {
            const root = mounted()
            await ask(root, "What tools do you use?")
            await flush()
            expect(root.querySelectorAll("output").length).toBe(1)
            expect(root.querySelector("section")?.getAttribute("aria-busy")).toBe("true")
            await ask(root, "How can I contact you?")
            await flush()
            expect(root.querySelectorAll("output").length).toBe(1)
            resolveFetch(jsonResponse(answer, 200))
            await flush()
            expect(root.textContent).toContain("Kevin automates the boring parts first.")
            expect(root.querySelector("section")?.getAttribute("aria-busy")).toBeNull()
        } finally {
            vi.unstubAllGlobals()
        }
    })

    it("dismisses the answered entry back to the empty state", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn(async () => jsonResponse(answer, 200)),
        )
        try {
            const root = mounted()
            await ask(root, "What tools do you use?")
            await flush()
            const dismiss = [...root.querySelectorAll("button")].find(
                (button) => button.getAttribute("aria-label") === "Dismiss answer",
            )
            dismiss?.click()
            await flush()
            expect(root.textContent).toContain("Ask anything about the site.")
        } finally {
            vi.unstubAllGlobals()
        }
    })
})
