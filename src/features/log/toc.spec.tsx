import type { LogTocEntry } from "@core/content/model"
import { LogToc, LogTocDisclosure } from "@features/log/toc"
import { renderToContainer } from "@testing/render"
import { describe, expect, it } from "vite-plus/test"

const entries: LogTocEntry[] = [
    { id: "before-building", text: "Before building" },
    { id: "during-implementation", text: "During implementation" },
]

describe("the log table of contents", () => {
    it("links the rail to every section", () => {
        const view = renderToContainer(() => <LogToc entries={entries} />)
        const links = [...view.querySelectorAll('nav[aria-label="On this page"] a')]

        expect(links.map((link) => link.getAttribute("href"))).toEqual(["#before-building", "#during-implementation"])
        expect(links.map((link) => link.textContent)).toEqual(["Before building", "During implementation"])
    })

    it("stays hidden when there is nothing to navigate", () => {
        const rail = renderToContainer(() => <LogToc entries={entries.slice(0, 1)} />)
        const disclosure = renderToContainer(() => <LogTocDisclosure entries={[]} />)

        expect(rail.querySelector("nav")).toBeNull()
        expect(disclosure.querySelector("details")).toBeNull()
    })
})
