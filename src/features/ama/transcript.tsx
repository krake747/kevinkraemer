import type { AmaAnswer } from "@features/ama/client"
import { StackRow } from "@pattern/stack"
import { Anchor } from "@ui/anchor"
import { For, Match, Show, Switch } from "solid-js"

export type AmaEntry =
    | { id: number; question: string; status: "loading" }
    | { id: number; question: string; status: "ready"; answer: AmaAnswer }
    | { id: number; question: string; status: "failed"; detail: string; hint?: string }

export function AmaTranscript(props: { entries: readonly AmaEntry[] }) {
    return (
        <div aria-live="polite" aria-atomic="false" class="flex flex-col gap-2">
            <Show
                when={props.entries.length > 0}
                fallback={
                    <StackRow size="roomy">
                        <p class="font-mono text-sm text-stone-700 dark:text-stone-300">
                            Ask anything about the site. Answers come only from published pages and list sources.
                        </p>
                        <p class="mt-2 font-mono text-xs text-stone-600 dark:text-stone-400">
                            Start with a suggested topic below, or type your own.
                        </p>
                    </StackRow>
                }
            >
                <For each={props.entries}>
                    {(entry) => (
                        <StackRow size="relaxed">
                            <p class="font-mono text-sm text-stone-900 dark:text-stone-100">
                                <span aria-hidden="true" class="text-emerald-700 dark:text-emerald-400">
                                    {"$ "}
                                </span>
                                {entry.question}
                            </p>
                            <Switch>
                                <Match when={entry.status === "loading"}>
                                    <p class="mt-4 font-mono text-xs text-stone-600 dark:text-stone-400">
                                        Reading published pages...
                                    </p>
                                </Match>
                                <Match when={entry.status === "ready" ? entry : undefined}>
                                    {(ready) => (
                                        <>
                                            <Show when={ready().answer.summary}>
                                                {(summary) => (
                                                    <p class="mt-4 max-w-prose text-base/[1.8] text-stone-600 dark:text-stone-400">
                                                        {summary()}
                                                    </p>
                                                )}
                                            </Show>
                                            <ul class="mt-4 flex flex-col gap-3">
                                                <For each={ready().answer.sources}>
                                                    {(source) => (
                                                        <li class="min-w-0">
                                                            <Anchor href={source.path} variant="muted">
                                                                {source.title}
                                                            </Anchor>
                                                            <span class="mt-1 block text-sm/relaxed text-stone-600 dark:text-stone-400">
                                                                {source.description}
                                                            </span>
                                                        </li>
                                                    )}
                                                </For>
                                            </ul>
                                        </>
                                    )}
                                </Match>
                                <Match when={entry.status === "failed" ? entry : undefined}>
                                    {(failed) => (
                                        <>
                                            <p class="mt-4 font-mono text-sm text-stone-700 dark:text-stone-300">
                                                {failed().detail}
                                            </p>
                                            <Show when={failed().hint}>
                                                {(hint) => (
                                                    <p class="mt-2 font-mono text-xs text-stone-600 dark:text-stone-400">
                                                        {hint()}
                                                    </p>
                                                )}
                                            </Show>
                                        </>
                                    )}
                                </Match>
                            </Switch>
                        </StackRow>
                    )}
                </For>
            </Show>
        </div>
    )
}
