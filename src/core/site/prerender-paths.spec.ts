import { prerenderPaths, sitemapPaths } from "@core/site/prerender-paths"
import { describe, expect, it } from "vite-plus/test"

const content = {
    logs: [{ id: "first" }, { id: "second" }],
    projects: [{ id: "site" }],
}

describe("the prerender path list", () => {
    it("adds log and project paths to the static routes", () => {
        const paths = prerenderPaths(content)
        expect(paths).toContain("/")
        expect(paths).toContain("/search")
        expect(paths).toContain("/logs/first")
        expect(paths).toContain("/logs/second")
        expect(paths).toContain("/projects/site")
    })
})

describe("the sitemap path list", () => {
    it("drops the search page and sorts", () => {
        const paths = sitemapPaths(content)
        expect(paths).not.toContain("/search")
        expect(paths).toContain("/logs/first")
        expect(paths).toEqual([...paths].toSorted())
    })
})
