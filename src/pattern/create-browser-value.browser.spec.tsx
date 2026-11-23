import { createBrowserValue, createHydrated } from "@pattern/create-browser-value"
import { renderToContainer } from "@testing/render"
import { describe, expect, it } from "vite-plus/test"

const SERVER_VALUE = "server"
const BROWSER_VALUE = "browser"

function Probe() {
    const value = createBrowserValue(SERVER_VALUE, () => BROWSER_VALUE)
    return <span>{value()}</span>
}

function HydratedProbe() {
    const hydrated = createHydrated()
    return <span>{String(hydrated())}</span>
}

describe("a browser value", () => {
    it("shows the server value until the browser reads the real one", () => {
        expect(renderToContainer(() => <Probe />).textContent).toBe(BROWSER_VALUE)
    })

    it("marks the page hydrated once the browser takes over", () => {
        expect(renderToContainer(() => <HydratedProbe />).textContent).toBe("true")
    })
})
