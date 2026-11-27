import { AMA_QUESTIONS } from "@features/ama/questions"
import { StackRow } from "@pattern/stack"
import { cx } from "@ui/cva.config"
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
                                        "group flex w-full items-center gap-4 text-start disabled:opacity-50",
                                    )}
                                />
                            )}
                        >
                            <span class="min-w-0 flex-1 font-mono text-sm text-stone-700 transition-colors group-hover:text-emerald-800 dark:text-stone-300 dark:group-hover:text-emerald-400">
                                {suggested}
                            </span>
                        </StackRow>
                    </li>
                )}
            </For>
        </ul>
    )
}
