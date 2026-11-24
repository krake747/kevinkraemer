import type { LogEntry } from "@core/content/model"
import { LogEntryPanel } from "@features/log/entry-panel"
import { LogFilterDisclosure } from "@features/log/filter-disclosure"
import { LogFilterEmpty } from "@features/log/filter-empty"
import { LogFilterProvider, useLogFilter } from "@features/log/filter-provider"
import { LogFilterRail } from "@features/log/filter-rail"
import { LogFilterSearch } from "@features/log/filter-search"
import { LogFilterTags } from "@features/log/filter-tags"
import { Register, RegisterWithRail } from "@pattern/register"
import { For, type VoidProps } from "solid-js"

function LogFilterList() {
    const { state } = useLogFilter()

    return (
        <Register
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
        </Register>
    )
}

export function LogFilter(props: VoidProps<{ entries: LogEntry[] }>) {
    return (
        <LogFilterProvider entries={props.entries}>
            <RegisterWithRail
                rail={
                    <LogFilterRail>
                        <LogFilterTags />
                    </LogFilterRail>
                }
            >
                <LogFilterSearch />
                <LogFilterDisclosure>
                    <LogFilterTags />
                </LogFilterDisclosure>
                <LogFilterList />
                <LogFilterEmpty />
            </RegisterWithRail>
        </LogFilterProvider>
    )
}
