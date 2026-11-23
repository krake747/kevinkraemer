import { sortByOrder } from "@core/content/model"
import { siteContent } from "@core/content/site-content"
import { isNonEmpty } from "@core/non-empty"
import { UsesSection } from "@features/uses/section"
import { ProseShell } from "@pattern/prose-shell"
import { Seo } from "@pattern/seo"
import { defineFileRoute } from "@solidjs/router/fs"
import { For } from "solid-js"

const SORTED_SECTIONS = sortByOrder(siteContent.uses)

const SECTION_LINKS = SORTED_SECTIONS.map((section) => ({
    label: `#${section.id}`,
    href: `/uses#${section.id}`,
}))
if (!isNonEmpty(SECTION_LINKS)) {
    throw new Error("uses sections are empty")
}

export const route = defineFileRoute("/uses", { info: { sections: SECTION_LINKS } })

export default function UsesRoute() {
    return (
        <ProseShell command="cat uses.md" title="The setup." lede="The tools I run, and why.">
            <Seo
                title="Uses: the tools I run"
                description="The setup: the tools I run, and why. Editor, terminal, OS, languages, models, hardware, and what I'm exploring."
                path="/uses"
            />
            <For each={SORTED_SECTIONS}>{(section) => <UsesSection section={section} />}</For>
        </ProseShell>
    )
}
