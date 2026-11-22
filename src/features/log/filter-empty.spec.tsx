import { LogFilterEmptyView } from "@features/log/filter-empty"
import { renderToContainer } from "@testing/render"
import { describe, expect, it } from "vite-plus/test"

function mounted(dirty: boolean): HTMLElement {
    return renderToContainer(() => <LogFilterEmptyView dirty={dirty} onClear={() => {}} />)
}

describe("the empty filter state", () => {
    it("offers to clear active filters", () => {
        const view = mounted(true)
        expect(view.textContent).toContain("No log entries match")
        expect(view.querySelector("button")).not.toBeNull()
    })

    it("welcomes an empty ledger without a clear action", () => {
        const view = mounted(false)
        expect(view.textContent).toContain("Coming soon")
        expect(view.querySelector("button")).toBeNull()
    })
})
