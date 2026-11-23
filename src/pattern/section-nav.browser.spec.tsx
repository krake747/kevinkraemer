import { PageSections, SectionNavProvider, useSectionNav, type SectionLink } from "@pattern/section-nav"
import { renderToContainer } from "@testing/render"
import { createSignal, flush, Show } from "solid-js"
import { describe, expect, it } from "vite-plus/test"

const LINKS: SectionLink[] = [
    { label: "#experience", href: "/cv#experience" },
    { label: "#skills", href: "/cv#skills" },
]

function Rail() {
    const { links } = useSectionNav()
    return (
        <nav>
            {links()
                .map((link) => link.label)
                .join(" ")}
        </nav>
    )
}

describe("page sections", () => {
    it("publishes links while the page is mounted", () => {
        const view = renderToContainer(() => (
            <SectionNavProvider>
                <PageSections links={LINKS} />
                <Rail />
            </SectionNavProvider>
        ))
        expect(view.querySelector("nav")?.textContent).toBe("#experience #skills")
    })

    it("clears links when the page unmounts", () => {
        const [show, setShow] = createSignal(true)
        const view = renderToContainer(() => (
            <SectionNavProvider>
                <Show when={show()}>
                    <PageSections links={LINKS} />
                </Show>
                <Rail />
            </SectionNavProvider>
        ))
        expect(view.querySelector("nav")?.textContent).toBe("#experience #skills")
        setShow(false)
        flush()
        expect(view.querySelector("nav")?.textContent).toBe("")
    })

    it("shows no links without a page", () => {
        const view = renderToContainer(() => (
            <SectionNavProvider>
                <Rail />
            </SectionNavProvider>
        ))
        expect(view.querySelector("nav")?.textContent).toBe("")
    })
})
