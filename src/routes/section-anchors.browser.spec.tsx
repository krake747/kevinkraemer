import CvRoute from "@routes/cv"
import HomeRoute from "@routes/index"
import UsesRoute from "@routes/uses"
import { renderToContainer } from "@testing/render"
import { describe, expect, it } from "vite-plus/test"

function missingAnchors(view: HTMLElement, ids: readonly string[]): string[] {
    return ids.filter((id) => view.querySelector(`#${id}`) === null)
}

describe("page section anchors", () => {
    it("lands every cv rail link on a section", () => {
        const view = renderToContainer(() => <CvRoute />)
        expect(missingAnchors(view, ["experience", "skills", "projects", "education"])).toEqual([])
    })

    it("lands every home rail link on a section", () => {
        const view = renderToContainer(() => <HomeRoute />)
        expect(missingAnchors(view, ["story", "logs", "contact"])).toEqual([])
    })

    it("lands every uses rail link on a section", () => {
        const view = renderToContainer(() => <UsesRoute />)
        expect(missingAnchors(view, ["workspace", "development", "ai-agents", "exploring"])).toEqual([])
    })
})
