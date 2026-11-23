import { useLogFilter } from "@features/log/filter-provider"
import { Button } from "@ui/button"
import { Show, type VoidProps } from "solid-js"

export function LogFilterEmpty() {
    const { state, actions } = useLogFilter()

    return (
        <Show when={state.visibleEntries().length === 0}>
            <LogFilterEmptyView dirty={state.hasActiveFilters()} onClear={actions.clear} />
        </Show>
    )
}

export function LogFilterEmptyView(props: VoidProps<{ dirty: boolean; onClear: () => void }>) {
    return (
        <div class="flex animate-confirm-in flex-col items-center gap-3 py-20 text-center">
            <p class="font-mono text-sm text-stone-600 dark:text-stone-300">
                {props.dirty ? "No log entries match the selected filters." : "No log entries yet. Coming soon."}
            </p>
            <Show when={props.dirty}>
                <Button intent="link" onClick={props.onClear}>
                    clear filters
                </Button>
            </Show>
        </div>
    )
}
