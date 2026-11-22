import { render } from "@solidjs/web"
import type { JSX } from "@solidjs/web"
import { afterEach } from "vite-plus/test"

const disposers: (() => void)[] = []

afterEach(() => {
    for (const dispose of disposers.splice(0)) {
        dispose()
    }
})

export function renderToContainer(code: () => JSX.Element): HTMLElement {
    const container = document.createElement("div")
    disposers.push(render(code, container))
    return container
}
