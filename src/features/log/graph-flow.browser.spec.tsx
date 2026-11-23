import type { GraphFlowSpec } from "@core/content/model"
import { LogGraphFlow } from "@features/log/graph-flow"
import { renderToContainer } from "@testing/render"
import { describe, expect, it } from "vite-plus/test"

function mounted(spec: GraphFlowSpec): HTMLElement {
    return renderToContainer(() => <LogGraphFlow spec={spec} />)
}

describe("the log graph", () => {
    it("renders one lane by default", () => {
        expect(mounted({ kind: "single", title: "CHAIN", flow: "chain" }).querySelectorAll("ol")).toHaveLength(1)
    })

    it("renders two lanes with captions for a comparison", () => {
        const view = mounted({ kind: "compare", title: "CHAIN VS SLICE", flow: "chain", compare: "now" })
        expect(view.querySelectorAll("ol")).toHaveLength(2)
        expect(view.textContent).toContain("SLICE MODEL")
    })

    it("renders three lanes when a third is given", () => {
        const spec: GraphFlowSpec = {
            kind: "compare",
            title: "CHAIN VS SLICE",
            flow: "chain",
            compare: "now",
            third: "chain",
        }
        expect(mounted(spec).querySelectorAll("ol")).toHaveLength(3)
    })
})
