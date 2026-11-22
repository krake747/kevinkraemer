import type { LogEntry } from "@core/content/model"
import { SectionShell } from "@pattern/section-shell"
import { ArrowRight } from "@ui/icon"
import { Stack } from "@ui/stack"
import { StackRow } from "@ui/stack-row"
import { For, Show, type ParentProps } from "solid-js"

export function HomeLogs(props: ParentProps<{ entries: LogEntry[] }>) {
    return (
        <Show when={props.entries.length > 0}>
            <SectionShell id="logs" command="tail -f ~/logs">
                <Stack class="reveal-item">
                    <For each={props.entries}>
                        {(entry) => (
                            <StackRow interactive class="flex items-center justify-between">
                                <a
                                    href={`/logs/${entry.id}`}
                                    class="flex min-w-0 flex-1 items-center justify-between gap-4"
                                >
                                    <div class="min-w-0 flex-1">
                                        <span class="block truncate font-semibold text-stone-900 group-hover:text-emerald-800 dark:text-stone-100 dark:group-hover:text-emerald-400">
                                            {entry.title}
                                        </span>
                                        <span class="mt-1 line-clamp-2 block text-sm/relaxed text-stone-600 dark:text-stone-400">
                                            {" "}
                                            {entry.description}
                                        </span>
                                    </div>
                                    <ArrowRight class="size-4 shrink-0 text-stone-600 transition-[color,translate] duration-150 ease-out-quart group-hover:text-emerald-700 dark:text-stone-400 dark:group-hover:text-emerald-400 group-hover:pointer-fine:translate-x-1" />
                                </a>
                            </StackRow>
                        )}
                    </For>
                </Stack>
                <div class="reveal-item mt-4 flex justify-end">{props.children}</div>
            </SectionShell>
        </Show>
    )
}
