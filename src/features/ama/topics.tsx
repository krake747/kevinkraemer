import { AMA_QUESTIONS } from "@features/ama/questions"
import { StackRow } from "@pattern/stack"
import { cx } from "@ui/cva.config"
import { ArrowRightIcon } from "@ui/icon"
import { For } from "solid-js"

export function AmaTopics(props: { busy: boolean; onSelect: (question: string) => void }) {
    return (
        <ul class="flex flex-col gap-2">
            <For each={AMA_QUESTIONS}>
                {(suggested) => (
                    <li>
                        <StackRow
                            size="compact"
                            interactive
                            render={(row) => (
                                <button
                                    {...row}
                                    type="button"
                                    disabled={props.busy}
                                    onClick={() => {
                                        props.onSelect(suggested)
                                    }}
                                    class={cx(
                                        row.class,
                                        "group flex w-full items-center justify-between gap-4 text-left disabled:opacity-50",
                                    )}
                                />
                            )}
                        >
                            <span class="min-w-0 flex-1 font-mono text-sm text-stone-700 transition-colors group-hover:text-emerald-800 dark:text-stone-300 dark:group-hover:text-emerald-400">
                                {suggested}
                            </span>
                            <span
                                aria-hidden="true"
                                class="hidden shrink-0 items-center text-stone-600 transition-colors group-hover:text-emerald-700 sm:inline-flex dark:text-stone-400 dark:group-hover:text-emerald-400"
                            >
                                <ArrowRightIcon class="size-4 transition-transform duration-150 ease-out-quart group-hover:pointer-fine:translate-x-1" />
                            </span>
                        </StackRow>
                    </li>
                )}
            </For>
        </ul>
    )
}
