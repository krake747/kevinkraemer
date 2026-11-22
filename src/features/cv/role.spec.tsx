import { CvEntry } from "@features/cv/entry"
import { CvRole } from "@features/cv/role"
import { renderToContainer } from "@testing/render"
import { describe, expect, it } from "vite-plus/test"

function mounted(current: boolean | undefined, tone?: "active" | "past"): HTMLElement {
    return renderToContainer(() => (
        <CvEntry current={current}>
            <CvRole tone={tone}>Engineer</CvRole>
        </CvEntry>
    ))
}

const classes = (container: HTMLElement) => container.firstElementChild?.getAttribute("class") ?? ""

describe("a CV role", () => {
    it("tones a role inside a current entry differently from one inside a past entry", () => {
        expect(classes(mounted(true))).not.toBe(classes(mounted(false)))
    })

    it("an explicit tone overrides the entry's current flag", () => {
        expect(classes(mounted(true, "past"))).toBe(classes(mounted(false)))
        expect(classes(mounted(false, "active"))).toBe(classes(mounted(true)))
    })
})
