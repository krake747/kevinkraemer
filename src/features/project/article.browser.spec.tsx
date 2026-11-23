import type { Project } from "@core/content/model"
import { ProjectArticle } from "@features/project/article"
import { renderToContainer } from "@testing/render"
import { describe, expect, it } from "vite-plus/test"

const project: Project = {
    id: "spec",
    name: "Spec",
    tagline: "A project for the test.",
    status: "shipped",
    year: 2026,
    stack: ["Solid", "TypeScript"],
    role: "Design and build",
    order: 1,
    problem: "The problem the project answers.",
    decisions: [{ title: "One seam", reason: "Because two callers needed it." }],
    evidence: [],
    changelog: [],
    html: "",
    graphs: [],
}

function mounted(): HTMLElement {
    return renderToContainer(() => <ProjectArticle project={project} />)
}

describe("the project article", () => {
    it("composes the problem and decisions under their headings", () => {
        const view = mounted()
        expect(view.querySelector("#problem-heading")?.textContent).toBe("Problem and point of view")
        expect(view.querySelector("#decisions-heading")?.textContent).toBe("Key decisions")
        expect(view.textContent).toContain("The problem the project answers.")
        expect(view.textContent).toContain("One seam")
    })

    it("omits sections with no entries", () => {
        const view = mounted()
        expect(view.querySelector("#evidence-heading")).toBeNull()
        expect(view.querySelector("#changelog-heading")).toBeNull()
    })
})
