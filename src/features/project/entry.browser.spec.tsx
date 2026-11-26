import type { Project } from "@core/content/model"
import { ProjectEntry } from "@features/project/entry"
import { renderToContainer } from "@testing/render"
import { describe, expect, it } from "vite-plus/test"

const project: Project = {
    id: "spec",
    name: "Spec",
    tagline: "A project for the test.",
    category: "tool",
    featured: false,
    status: "shipped",
    year: 2026,
    stack: ["Solid", "TypeScript"],
    role: "Design and build",
    order: 1,
    problem: "The problem the project answers.",
    decisions: [{ title: "One seam", reason: "Because two callers needed it." }],
    implementation: "A single module.",
    evidence: [],
    tradeoffs: [{ title: "No cache", reason: "Freshness beats speed here." }],
    resources: [{ label: "Repo", href: "https://example.com/repo", note: "Source." }],
    html: "",
    graphs: [],
}

function mounted(): HTMLElement {
    return renderToContainer(() => <ProjectEntry project={project} />)
}

describe("the project entry", () => {
    it("composes the problem, decisions, implementation, tradeoffs, and resources under their headings", () => {
        const view = mounted()
        expect(view.querySelector("#problem-heading")?.textContent).toBe("Problem and point of view")
        expect(view.querySelector("#decisions-heading")?.textContent).toBe("Key decisions")
        expect(view.querySelector("#implementation-heading")?.textContent).toBe("Technical implementation")
        expect(view.querySelector("#tradeoffs-heading")?.textContent).toBe("Challenges and trade-offs")
        expect(view.querySelector("#resources-heading")?.textContent).toBe("Links and resources")
        expect(view.textContent).toContain("The problem the project answers.")
        expect(view.textContent).toContain("One seam")
        expect(view.textContent).toContain("A single module.")
        expect(view.textContent).toContain("No cache")
        expect(view.textContent).toContain("Repo")
    })

    it("omits sections with no entries", () => {
        const sparse: Project = {
            ...project,
            decisions: [],
            implementation: undefined,
            evidence: [],
            tradeoffs: [],
            resources: [],
        }
        const view = renderToContainer(() => <ProjectEntry project={sparse} />)
        expect(view.querySelector("#decisions-heading")).toBeNull()
        expect(view.querySelector("#implementation-heading")).toBeNull()
        expect(view.querySelector("#evidence-heading")).toBeNull()
        expect(view.querySelector("#tradeoffs-heading")).toBeNull()
        expect(view.querySelector("#resources-heading")).toBeNull()
    })
})
