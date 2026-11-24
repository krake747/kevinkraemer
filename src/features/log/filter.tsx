import type { LogEntry } from "@core/content/model"
import { LogEntryPanel } from "@features/log/entry-panel"
import { LogFilterDisclosure } from "@features/log/filter-disclosure"
import { LogFilterEmpty } from "@features/log/filter-empty"
import { LogFilterProvider, useLogFilter } from "@features/log/filter-provider"
import { LogFilterRail } from "@features/log/filter-rail"
import { LogFilterSearch } from "@features/log/filter-search"
import { LogFilterTags } from "@features/log/filter-tags"
import { Stack } from "@ui/stack"
import { For, type VoidProps } from "solid-js"

function LogFilterList() {
    const { state } = useLogFilter()

    return (
        <Stack
            ref={(element) => {
                element.setAttribute("data-settled", "")
            }}
            class="animate-fade-up"
        >
            <For each={state.visibleEntries()} keyed={(entry) => entry.id}>
                {(entry) => (
                    <div class="filter-enter">
                        <LogEntryPanel entry={entry()} />
                    </div>
                )}
            </For>
        </Stack>
    )
}

export function LogFilter(props: VoidProps<{ entries: LogEntry[] }>) {
    return (
        <LogFilterProvider entries={props.entries}>
            <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_15rem]">
                <div class="flex min-w-0 flex-col gap-6">
                    <LogFilterSearch />
                    <LogFilterDisclosure>
                        <LogFilterTags />
                    </LogFilterDisclosure>
                    <LogFilterList />
                    <LogFilterEmpty />
                </div>
                <LogFilterRail>
                    <LogFilterTags />
                </LogFilterRail>
            </div>
        </LogFilterProvider>
    )
}
