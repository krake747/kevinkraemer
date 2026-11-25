import { DisclosureRow, DisclosureRowBody, DisclosureRowSummary } from "@pattern/disclosure-row"
import { PanelLabel } from "@ui/panel-label"
import { For } from "solid-js"

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

export function ContactStatusDisclosure() {
    return (
        <DisclosureRow>
            <DisclosureRowSummary>
                <span class="group-open:hidden">+ status</span>
                <span class="hidden group-open:inline">− status</span>
            </DisclosureRowSummary>
            <DisclosureRowBody>
                <ContactStatusRows />
            </DisclosureRowBody>
        </DisclosureRow>
    )
}

export function ContactStatusPanel() {
    return (
        <div>
            <PanelLabel id="contact-status-label" class="border-b border-stone-200 pb-2 dark:border-stone-800">
                status
            </PanelLabel>
            <ContactStatusRows />
        </div>
    )
}
