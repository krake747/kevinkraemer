import { siteContent } from "@core/content/site-content"
import { UsesSection } from "@features/uses/section"
import { DocumentPage, PageHeaderTitle } from "@pattern/page"
import { Seo } from "@pattern/seo"
import { TerminalCommandHeader } from "@pattern/terminal"
import { For } from "solid-js"

const sections = siteContent.credits.toSorted((a, b) => a.order - b.order)

export default function CreditsRoute() {
    return (
        <DocumentPage>
            <header class="animate-rise">
                <TerminalCommandHeader command="cat credits.md" class="mb-4" />
                <PageHeaderTitle>Credits</PageHeaderTitle>
            </header>
            <Seo
                title="Credits"
                description="What this site is built with and run on: the stack, the services, and the models behind the ask box."
                path="/credits"
            />
            <For each={sections}>{(section) => <UsesSection section={section} />}</For>
        </DocumentPage>
    )
}
