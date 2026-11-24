import { sortByOrder, type AboutEntry } from "@core/content/model"
import { siteContent } from "@core/content/site-content"
import { SectionShell } from "@pattern/section-shell"
import { ProseSectionBody } from "@ui/prose-section"
import { SectionHeading } from "@ui/section-heading"
import { For, type VoidProps } from "solid-js"

type Column = {
    entries: AboutEntry[]
    class: string
}

function headingId(id: string): string {
    return `story-${id}-heading`
}

const SORTED_ABOUT = sortByOrder(siteContent.about)
const ABOUT_BY_ID = new Map(SORTED_ABOUT.map((entry) => [entry.id, entry] as const))

function byId(id: string): AboutEntry {
    const found = ABOUT_BY_ID.get(id)
    if (found === undefined) {
        throw new Error(`Missing about entry: ${id}`)
    }
    return found
}

const ABOUT_COLUMNS: Column[] = [
    { entries: [byId("intro"), byId("current-role")], class: "flex flex-col gap-12 lg:col-span-5" },
    { entries: [byId("philosophy"), byId("elsewhere")], class: "flex flex-col gap-12 lg:col-span-7 lg:pl-12" },
]

export function HomeAbout(props: VoidProps<{ id: string }>) {
    return (
        <SectionShell id={props.id} command="cat story.md">
            <div class="grid gap-12 lg:grid-cols-12">
                <For each={ABOUT_COLUMNS}>
                    {(column) => (
                        <div class={column.class}>
                            <For each={column.entries}>
                                {(entry) => (
                                    <div class="reveal-item">
                                        <SectionHeading id={headingId(entry.id)}>{entry.title}</SectionHeading>
                                        <ProseSectionBody>
                                            <div class="contents" innerHTML={entry.html} />
                                        </ProseSectionBody>
                                    </div>
                                )}
                            </For>
                        </div>
                    )}
                </For>
            </div>
        </SectionShell>
    )
}
