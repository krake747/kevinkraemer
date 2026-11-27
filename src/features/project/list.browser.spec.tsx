import type { Project } from "@core/content/model"
import { ProjectList } from "@features/project/list"
import { renderToContainer } from "@testing/render"
import { describe, expect, it } from "vite-plus/test"

function fixture(overrides: Partial<Project> & { id: string }): Project {
    return {
        name: overrides.id,
        tagline: "A project for the test.",
        featured: false,
        status: "Live",
        stack: ["Solid"],
        role: "Design and build",
        order: 1,
        problem: "The problem the project answers.",
        decisions: [],
        tradeoffs: [],
        html: "",
        graphs: [],
        ...overrides,
    }
}

describe("the project list", () => {
    it("renders featured entries once, outside the compact list", () => {
        const view = renderToContainer(() => (
            <ProjectList
                projects={[fixture({ id: "alpha", featured: true, order: 1 }), fixture({ id: "beta", order: 2 })]}
            />
        ))
        const featured = view.querySelector('[aria-label="Featured case files"]')
        const rest = view.querySelector('[aria-label="All case files"]')
        expect(featured?.textContent).toContain("alpha")
        expect(featured?.textContent).not.toContain("beta")
        expect(rest?.textContent).toContain("beta")
        expect(rest?.textContent).not.toContain("alpha")
    })

    it("omits the compact list when nothing is left", () => {
        const view = renderToContainer(() => <ProjectList projects={[fixture({ id: "alpha", featured: true })]} />)
        expect(view.querySelector('[aria-label="Featured case files"]')?.textContent).toContain("alpha")
        expect(view.querySelector('[aria-label="All case files"]')).toBeNull()
    })

    it("renders an empty register when there are no projects", () => {
        const view = renderToContainer(() => <ProjectList projects={[]} />)
        expect(view.textContent).toContain("No case files yet.")
    })

    it("shows a cursor block after the featured status line", () => {
        const view = renderToContainer(() => <ProjectList projects={[fixture({ id: "alpha", featured: true })]} />)
        const featured = view.querySelector('[aria-label="Featured case files"]')
        expect(featured?.querySelector('[aria-hidden="true"]')).not.toBeNull()
    })
})
