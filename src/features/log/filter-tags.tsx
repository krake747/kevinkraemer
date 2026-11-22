import { useLogFilter } from "@features/log/filter-provider"
import { Chip } from "@ui/chip"
import { For } from "solid-js"

export function LogFilterTags() {
    const { state, actions } = useLogFilter()

    return (
        <div class="flex flex-wrap items-center gap-1.5">
            <For each={state.tags()}>
                {(tag) => (
                    <Chip selected={state.selectedTags().includes(tag)} onClick={() => actions.toggleTag(tag)}>
                        #{tag}
                    </Chip>
                )}
            </For>
        </div>
    )
}
