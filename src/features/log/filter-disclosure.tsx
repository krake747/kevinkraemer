import { useLogFilter } from "@features/log/filter-provider"
import { DisclosureRow, DisclosureRowBody, DisclosureRowSummary } from "@pattern/disclosure-row"
import { Show, type ParentProps } from "solid-js"

export function LogFilterDisclosure(props: ParentProps) {
    const { state } = useLogFilter()

    return (
        <Show when={state.tags().length > 0}>
            <DisclosureRow>
                <DisclosureRowSummary>
                    <span class="group-open:hidden">+ filter by tag</span>
                    <span class="hidden group-open:inline">− filter by tag</span>
                    <span class="text-stone-600 tabular-nums dark:text-stone-400">
                        {" "}
                        · {state.counts().shown}/{state.counts().total}
                    </span>
                </DisclosureRowSummary>
                <DisclosureRowBody>{props.children}</DisclosureRowBody>
            </DisclosureRow>
        </Show>
    )
}
