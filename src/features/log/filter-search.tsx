import { useLogFilter } from "@features/log/filter-provider"
import { Button } from "@ui/button"
import { Input, InputPrompt } from "@ui/input"
import { Show } from "solid-js"

export function LogFilterSearch() {
    const { state, actions } = useLogFilter()

    return (
        <div class="flex items-center gap-3">
            <Input
                type="text"
                placeholder="Search logs…"
                value={state.input()}
                onInput={(event) => {
                    actions.updateQuery(event.currentTarget.value)
                }}
                aria-label="Search logs"
            >
                <InputPrompt />
            </Input>

            <Show when={state.hasActiveFilters()}>
                <Button class="shrink-0" onClick={actions.clear}>
                    clear
                </Button>
            </Show>
        </div>
    )
}
