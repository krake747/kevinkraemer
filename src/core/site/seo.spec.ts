import { buildTitle } from "@core/site/seo"
import { site } from "@core/site/site-meta"
import { describe, expect, it } from "vite-plus/test"

describe("page titles", () => {
    it("appends site name when missing", () => {
        expect(buildTitle("About")).toBe(`About · ${site.name}`)
    })

    it("keeps title when it already contains site name", () => {
        expect(buildTitle(`About · ${site.name}`)).toBe(`About · ${site.name}`)
        expect(buildTitle(site.name)).toBe(site.name)
    })
})
