import { DisclosureRow, DisclosureRowBody, DisclosureRowSummary } from "@pattern/disclosure-row"
import { RecordRow, RecordRowLabel } from "@pattern/record"
import { PanelLabel } from "@pattern/section"
import { Stack } from "@pattern/stack"
import { For } from "solid-js"

const STATUS_ROWS = [
    { label: "base", value: "Luxembourg · CET" },
    { label: "replies", value: "~2 business days" },
    { label: "open to", value: "roles · projects" },
]

function ContactStatusRows() {
    return (
        <Stack render={(renderProps) => <dl {...renderProps} />} class="font-mono text-xs">
            <For each={STATUS_ROWS}>
                {(row) => (
                    <RecordRow>
                        <RecordRowLabel>{row.label}</RecordRowLabel>
                        <dd class="text-stone-700 tabular-nums dark:text-stone-300">{row.value}</dd>
                    </RecordRow>
                )}
            </For>
        </Stack>
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
