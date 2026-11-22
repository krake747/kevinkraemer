import { DisclosureRow } from "@pattern/disclosure-row"
import { PanelLabel } from "@ui/panel-label"
import { For, Show } from "solid-js"

const STATUS_ROWS = [
    { label: "base", value: "Luxembourg · CET" },
    { label: "replies", value: "~2 business days" },
    { label: "open to", value: "roles · projects" },
]

function ContactStatusRows() {
    return (
        <dl class="flex flex-col gap-3 font-mono text-xs">
            <For each={STATUS_ROWS}>
                {(row) => (
                    <div>
                        <dt class="tracking-widest text-stone-600 uppercase dark:text-stone-400">{row.label}</dt>
                        <dd class="text-stone-700 tabular-nums dark:text-stone-300">{row.value}</dd>
                    </div>
                )}
            </For>
        </dl>
    )
}

export function ContactStatus(props: { as: "details" | "aside" }) {
    return (
        <Show
            when={props.as === "details"}
            fallback={
                <div class="sticky top-[calc(var(--header-h)+1rem)] flex flex-col gap-4">
                    <div>
                        <PanelLabel class="border-b border-stone-200 pb-2 dark:border-stone-800">status</PanelLabel>
                        <ContactStatusRows />
                    </div>
                </div>
            }
        >
            <DisclosureRow
                summary={
                    <>
                        <span class="group-open:hidden">+ status</span>
                        <span class="hidden group-open:inline">− status</span>
                    </>
                }
            >
                <ContactStatusRows />
            </DisclosureRow>
        </Show>
    )
}
