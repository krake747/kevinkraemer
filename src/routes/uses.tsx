import { sortByOrder } from "@core/content/model"
import { siteContent } from "@core/content/site-content"
import { mapToNonEmpty } from "@core/non-empty"
import { UsesSection } from "@features/uses/section"
import { DocumentPage } from "@pattern/document-page"
import { Seo } from "@pattern/seo"
import { defineFileRoute } from "@solidjs/router/fs"
import { For } from "solid-js"

const SORTED_SECTIONS = sortByOrder(siteContent.uses)

const SECTION_LINKS = mapToNonEmpty(
    SORTED_SECTIONS,
    (section) => ({
        label: `#${section.id}`,
        href: `/uses#${section.id}`,
    }),
    "uses sections",
)

export const route = defineFileRoute("/uses", { info: { sections: SECTION_LINKS } })

export default function UsesRoute() {
    return (
        <DocumentPage command="cat uses.md" title="The setup.">
            <Seo
                title="Uses: the tools I run"
                description="The setup: the tools I run, and why. Editor, terminal, OS, languages, models, hardware, and what I'm exploring."
                path="/uses"
            />
            <For each={SORTED_SECTIONS}>{(section) => <UsesSection section={section} />}</For>
        </DocumentPage>
    )
}
