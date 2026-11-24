import type { LogEntry } from "@core/content/model"
import { formatDateShort } from "@core/time/date"
import { ArrowRight } from "@ui/icon"
import { SectionHeading } from "@ui/section-heading"
import { Stack } from "@ui/stack"
import { StackRow } from "@ui/stack-row"
import { For, type VoidProps } from "solid-js"

export function LogRelated(props: VoidProps<{ entries: LogEntry[] }>) {
    return (
        <>
            {props.entries.length > 0 ? (
                <div class="mt-10">
                    <SectionHeading id="log-related-heading">related</SectionHeading>
                    <Stack>
                        <For each={props.entries}>
                            {(item) => (
                                <StackRow interactive class="flex items-center justify-between">
                                    <a href={`/logs/${item.id}`} class="contents">
                                        <div class="min-w-0 flex-1">
                                            <span class="block truncate font-semibold text-stone-900 group-hover:text-emerald-800 dark:text-stone-100 dark:group-hover:text-emerald-400">
                                                {item.title}
                                            </span>
                                            <span class="mt-0.5 block font-mono text-xs text-stone-600 tabular-nums dark:text-stone-400">
                                                {formatDateShort(item.date)}
                                            </span>
                                        </div>
                                        <ArrowRight class="size-3 shrink-0 text-stone-400 transition-[color,translate] duration-150 ease-out-quart group-hover:text-emerald-700 dark:text-stone-500 dark:group-hover:text-emerald-400 group-hover:pointer-fine:translate-x-1" />
                                    </a>
                                </StackRow>
                            )}
                        </For>
                    </Stack>
                </div>
            ) : null}
        </>
    )
}
