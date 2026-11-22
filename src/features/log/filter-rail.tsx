import { useLogFilter } from "@features/log/filter-provider"
import { LogSubscribe } from "@features/log/subscribe"
import { PanelLabel } from "@ui/panel-label"
import { Show, type ParentProps } from "solid-js"

export function LogFilterRail(props: ParentProps) {
    const { state } = useLogFilter()

    return (
        <Show when={state.tags().length > 0}>
            <aside class="hidden lg:block">
                <div class="sticky top-[calc(var(--header-h)+1rem)] flex flex-col gap-4">
                    <div>
                        <PanelLabel>filter</PanelLabel>
                        <p class="font-mono text-xs text-stone-600 tabular-nums dark:text-stone-400">
                            {state.counts().shown}/{state.counts().total} entries
                        </p>
                    </div>
                    {props.children}
                    <LogSubscribe />
                </div>
            </aside>
        </Show>
    )
}
