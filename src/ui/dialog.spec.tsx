import type { JSX } from "@solidjs/web"
import { renderToContainer } from "@testing/render"
import { createAgent } from "@ui-sdk/solid/agent"
import type { DialogOpenChangeDetails } from "@ui-sdk/solid/dialog"
import {
    Dialog,
    DialogBackdrop,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@ui/dialog"
import { afterEach, describe, expect, it } from "vite-plus/test"

const agent = createAgent()

const tick = () => new Promise<void>((resolve) => setTimeout(resolve, 0))

const attached: HTMLElement[] = []

afterEach(() => {
    for (const node of attached.splice(0)) {
        node.remove()
    }
})

function renderAttached(code: () => JSX.Element) {
    const view = renderToContainer(code)
    document.body.appendChild(view)
    attached.push(view)
    return view
}

function ShareFrame(props: { onOpenChange?: (open: boolean, details: DialogOpenChangeDetails) => void }) {
    return (
        <Dialog onOpenChange={props.onOpenChange}>
            <DialogTrigger>Share</DialogTrigger>
            <DialogBackdrop />
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Share link</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose value="confirm">Done</DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function openShare(view: HTMLElement) {
    const trigger = view.querySelector("button")
    if (trigger) {
        trigger.click()
    }
    return trigger
}

describe("the dialog frame", () => {
    it("opens from its trigger and names itself by its title", async () => {
        const view = renderAttached(() => <ShareFrame />)
        expect(document.querySelector('[data-slot="dialog-content"]')).toBeNull()

        openShare(view)
        await tick()

        const content = document.querySelector('[data-slot="dialog-content"]')
        expect(content).not.toBeNull()
        expect(content?.querySelector('[data-slot="dialog-title"]')?.textContent).toBe("Share link")
        expect(document.querySelector('[data-slot="dialog-backdrop"]')).not.toBeNull()
    })

    it("renders header and footer chrome around title and close", async () => {
        const view = renderAttached(() => <ShareFrame />)
        await tick()

        openShare(view)
        await tick()

        expect(document.querySelector('[data-slot="dialog-header"]')).not.toBeNull()
        expect(document.querySelector('[data-slot="dialog-footer"]')).not.toBeNull()
    })

    it("closes on Escape and returns focus to its trigger", async () => {
        const view = renderAttached(() => <ShareFrame />)
        const trigger = openShare(view)
        await tick()
        expect(document.querySelector('[data-slot="dialog-content"]')).not.toBeNull()

        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }))
        await tick()

        expect(document.querySelector('[data-slot="dialog-content"]')).toBeNull()
        expect(document.activeElement).toBe(trigger)
    })

    it("reports the close button value on close", async () => {
        let returned: unknown
        const view = renderAttached(() => (
            <ShareFrame
                onOpenChange={(open, details) => {
                    if (!open) {
                        returned = details.returnValue
                    }
                }}
            />
        ))
        openShare(view)
        await tick()

        const close = document.querySelector('[data-slot="dialog-close"]')
        if (close instanceof HTMLElement) {
            close.click()
        }
        await tick()

        expect(returned).toBe("confirm")
        expect(document.querySelector('[data-slot="dialog-content"]')).toBeNull()
    })

    it("lets an agent find it by name and open it", async () => {
        renderAttached(() => <ShareFrame />)
        await tick()
        const labels = agent
            .snapshot()
            .filter((entry) => !entry.offPage)
            .map((entry) => entry.label)
        expect(labels).toContain("Share")

        const result = await agent.act({ steps: [{ ref: "Share", action: "press" }] })

        expect(result.error?.message).toBeUndefined()
        expect(result.ok).toBe(true)
        expect(document.querySelector('[data-slot="dialog-title"]')?.textContent).toBe("Share link")
    })
})
