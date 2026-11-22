import type { TapePrint } from "@core/ask/tape"
import { canonicalFor } from "@core/site/urls"
import { listResources, readResource } from "@features/mcp/resources"
import { describe, expect, it } from "vite-plus/test"

const prints: TapePrint[] = [
    {
        path: "/cv",
        title: "CV",
        description: "Career facts",
        content: "Built a risk engine at Dennemeyer.",
    },
]

describe("the resource list", () => {
    it("publishes every tape page at its canonical URL", () => {
        const resources = listResources(prints)
        expect(resources.length).toBeGreaterThan(0)
        expect(resources.map((resource) => resource.uri)).toContain(canonicalFor("/cv"))
        expect(resources[0]).toMatchObject({ mimeType: "text/markdown" })
    })
})

describe("reading a resource", () => {
    it("returns the page as markdown with its canonical URL", () => {
        const uri = canonicalFor("/cv")
        const contents = readResource(prints, uri)
        expect(contents?.mimeType).toBe("text/markdown")
        expect(contents?.text).toMatch(/^# .+\n\n/)
        expect(contents?.text).toContain(`Canonical: ${uri}`)
    })

    it("returns nothing for a page that is not published", () => {
        expect(readResource(prints, canonicalFor("/not-a-page"))).toBeUndefined()
    })
})
