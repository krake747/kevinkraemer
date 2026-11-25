import { ContactStatusDisclosure, ContactStatusPanel } from "@features/contact/status"
import { renderToContainer } from "@testing/render"
import { describe, expect, it } from "vite-plus/test"

describe("the contact form status", () => {
    it("renders a disclosure row on small screens", () => {
        const view = renderToContainer(() => <ContactStatusDisclosure />)
        expect(view.querySelector("details")).not.toBeNull()
        expect(view.textContent).toContain("Luxembourg")
    })

    it("renders the static rail otherwise", () => {
        const view = renderToContainer(() => <ContactStatusPanel />)
        expect(view.querySelector("details")).toBeNull()
        expect(view.textContent).toContain("Luxembourg")
    })
})
