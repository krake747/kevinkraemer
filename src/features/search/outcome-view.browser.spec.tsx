import { searchHits, type SearchHit, type SearchOutcome } from "@core/search/pagefind"
import { SearchOutcomeView } from "@features/search/outcome-view"
import { renderToContainer } from "@testing/render"
import { describe, expect, it } from "vite-plus/test"

const hit: SearchHit = {
    title: "Solid guide",
    excerpt: "A guide to Solid.",
    href: "/logs/solid-guide",
}

function mounted(outcome: SearchOutcome, query: string): HTMLElement {
    return renderToContainer(() => <SearchOutcomeView outcome={outcome} query={query} onClear={() => {}} />)
}

describe("search outcomes", () => {
    it("explains an unavailable index", () => {
        expect(mounted({ kind: "failure", failure: "unavailable" }, "x").textContent).toContain(
            "Search index unavailable",
        )
    })

    it("lists hits when present", () => {
        expect(mounted(searchHits([hit], 1), "solid").textContent).toContain("A guide to Solid")
    })

    it("names the query when nothing matches", () => {
        expect(mounted(searchHits([], 0), "zzz").textContent).toContain("zzz")
    })
})
