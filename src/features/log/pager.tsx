import type { LogEntry } from "@core/content/model"
import { ArrowLeft, ArrowRight } from "@ui/icon"
import { Show } from "solid-js"

export function LogPager(props: { older?: LogEntry; newer?: LogEntry }) {
    return (
        <div class="mt-10 grid grid-cols-2 gap-6">
            <Show when={props.older} fallback={<div />}>
                {(item) => (
                    <a href={`/logs/${item().id}`} class="group hit-area-y-2 flex flex-col items-start gap-1">
                        <span class="inline-flex items-center gap-1 font-mono text-xs text-stone-600 dark:text-stone-400">
                            <ArrowLeft class="size-3 shrink-0" /> Older
                        </span>
                        <span class="font-semibold text-stone-900 transition-colors group-hover:text-emerald-800 dark:text-stone-100 dark:group-hover:text-emerald-400">
                            {" "}
                            {item().title}
                        </span>
                    </a>
                )}
            </Show>{" "}
            <Show when={props.newer} fallback={<div />}>
                {(item) => (
                    <a href={`/logs/${item().id}`} class="group hit-area-y-2 flex flex-col items-end gap-1 text-right">
                        <span class="inline-flex items-center gap-1 font-mono text-xs text-stone-600 dark:text-stone-400">
                            Newer <ArrowRight class="size-3 shrink-0" />
                        </span>
                        <span class="font-semibold text-stone-900 transition-colors group-hover:text-emerald-800 dark:text-stone-100 dark:group-hover:text-emerald-400">
                            {" "}
                            {item().title}
                        </span>
                    </a>
                )}
            </Show>
        </div>
    )
}
