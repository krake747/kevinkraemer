import { sortByOrder } from "@core/content/model"
import { siteContent } from "@core/content/site-content"
import { UsesNav } from "@features/uses/nav"
import { UsesSection } from "@features/uses/section"
import { ProseShell } from "@pattern/prose-shell"
import { Seo } from "@pattern/seo"
import { For } from "solid-js"

export default function UsesRoute() {
    const sections = sortByOrder(siteContent.uses)

    return (
        <ProseShell command="cat uses.md" title="The setup." lede="The tools I run, and why.">
            <Seo
                title="Uses: the tools I run"
                description="The setup: the tools I run, and why. Editor, terminal, OS, languages, models, hardware, and what I'm exploring."
                path="/uses"
            />
            <UsesNav sections={sections} updated={siteContent.meta.usesUpdated} />
            <For each={sections}>{(section) => <UsesSection section={section} />}</For>
        </ProseShell>
    )
}
