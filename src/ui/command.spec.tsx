import type { JSX } from "@solidjs/web"
import { renderToContainer } from "@testing/render"
import { createAgent } from "@ui-sdk/solid/agent"
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@ui/command"
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

function SearchFrame(props: { onAction?: (value: string) => void }) {
    return (
        <Command onAction={props.onAction}>
            <CommandInput aria-label="Search actions" />
            <CommandEmpty>No actions found.</CommandEmpty>
            <CommandList>
                <CommandItem value="new-file">New file</CommandItem>
                <CommandItem value="billing">Billing</CommandItem>
            </CommandList>
        </Command>
    )
}

function search(view: HTMLElement, text: string) {
    const input = view.querySelector("input")
    if (input) {
        input.value = text
        input.dispatchEvent(new Event("input", { bubbles: true }))
    }
    return input
}

function itemByText(view: HTMLElement, text: string) {
    return [...view.querySelectorAll('[data-slot="command-item"]')].find(
        (item): item is HTMLElement => item instanceof HTMLElement && item.textContent === text,
    )
}

describe("the command frame", () => {
    it("filters the list as the search text changes", async () => {
        const view = renderAttached(() => <SearchFrame />)
        await tick()

        search(view, "bil")
        await tick()

        expect(itemByText(view, "Billing")?.hidden).toBe(false)
        expect(itemByText(view, "New file")?.hidden).toBe(true)
    })

    it("runs the highlighted command on Enter", async () => {
        const ran: string[] = []
        const view = renderAttached(() => <SearchFrame onAction={(value) => ran.push(value)} />)
        await tick()

        const input = search(view, "bil")
        await tick()
        input?.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }))
        await tick()

        expect(ran).toEqual(["billing"])
    })

    it("shows the empty message when nothing matches", async () => {
        const view = renderAttached(() => <SearchFrame />)
        await tick()

        search(view, "zzz")
        await tick()

        expect(view.textContent).toContain("No actions found.")
        expect(itemByText(view, "Billing")?.hidden).toBe(true)
        expect(itemByText(view, "New file")?.hidden).toBe(true)
    })

    it("lets an agent find a command by name and run it", async () => {
        const ran: string[] = []
        renderAttached(() => <SearchFrame onAction={(value) => ran.push(value)} />)
        await tick()
        const entry = agent
            .snapshot()
            .filter((next) => !next.offPage)
            .find((next) => next.label === "Search actions")
        const value = entry?.items?.find((item) => item.label === "Billing")?.value
        expect(value).toBe("billing")

        const result = await agent.act({ steps: [{ ref: "Search actions", action: "run", args: [value] }] })

        expect(result.error?.message).toBeUndefined()
        expect(result.ok).toBe(true)
        expect(ran).toEqual(["billing"])
    })
})
