import type { JSX } from "@solidjs/web"
import { renderToContainer } from "@testing/render"
import { renderElement } from "@ui/render"
import { afterEach, describe, expect, it } from "vite-plus/test"

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

describe("the render helper", () => {
    it("renders the default tag when no render override is given", () => {
        const view = renderAttached(() =>
            renderElement({ defaultTag: "div", render: () => undefined, props: () => ({ class: "boxed" }) }),
        )
        expect(view.querySelector("div.boxed")).not.toBeNull()
    })

    it("renders the span default without a wrapping fragment", () => {
        const view = renderAttached(() =>
            renderElement({ defaultTag: "span", render: () => undefined, props: () => ({ class: "tagged" }) }),
        )
        expect(view.querySelector("span.tagged")).not.toBeNull()
        expect(view.firstElementChild?.tagName).toBe("SPAN")
    })

    it("forwards props to the render override", () => {
        const view = renderAttached(() =>
            renderElement({
                defaultTag: "div",
                render: () => (props) => <ul {...props} />,
                props: () => ({ class: "listed", "aria-label": "Entries" }),
            }),
        )
        const list = view.querySelector("ul.listed")
        expect(list?.getAttribute("aria-label")).toBe("Entries")
    })
})
