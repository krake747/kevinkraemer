import type { AmaAnswer } from "@features/ama/client"
import { createCopyFeedback } from "@pattern/create-copy-feedback"
import {
    EmptyRegister,
    EmptyRegisterNote,
    EmptyRegisterTitle,
    RegisterRow,
    RegisterRowDescription,
    RegisterRowTitle,
} from "@pattern/register"
import { Stack, StackRow } from "@pattern/stack"
import { Button } from "@ui/button"
import { XIcon } from "@ui/icon"
import { For, Match, Show, Switch } from "solid-js"

export type AmaEntry =
    | { id: number; question: string; status: "loading" }
    | { id: number; question: string; status: "ready"; answer: AmaAnswer }
    | { id: number; question: string; status: "failed"; detail: string; hint?: string }

function copyText(answer: AmaAnswer): string {
    const lines = answer.sources.map((source) => `- ${source.title} (${source.path})`)
    return [answer.summary ?? "", "Sources:", ...lines].filter((part) => part.length > 0).join("\n")
}

function AmaCopyButton(props: { answer: AmaAnswer }) {
    const { copyLabel, copy } = createCopyFeedback()
    return (
        <Button
            intent="muted"
            aria-label="Copy answer"
            onClick={() => {
                void copy(copyText(props.answer))
            }}
        >
            {copyLabel()}
        </Button>
    )
}

export function AmaTranscript(props: {
    entries: readonly AmaEntry[]
    onRetry: (id: number) => void
    onDismiss: (id: number) => void
}) {
    const busy = (): boolean => props.entries.some((entry) => entry.status === "loading")
    return (
        <div class="flex flex-col gap-2">
            <Show
                when={props.entries.length > 0}
                fallback={
                    <EmptyRegister>
                        <EmptyRegisterTitle>
                            Ask anything about the site. Answers come only from published pages and list sources.
                        </EmptyRegisterTitle>
                        <EmptyRegisterNote>Start with a suggested question, or type your own.</EmptyRegisterNote>
                    </EmptyRegister>
                }
            >
                <For each={props.entries}>
                    {(entry) => (
                        <StackRow size="default" data-ama-entry={entry.id} tabindex={-1}>
                            <div class="flex items-start justify-between gap-4">
                                <p class="min-w-0 flex-1 font-mono text-sm text-stone-900 dark:text-stone-100">
                                    <span aria-hidden="true" class="text-emerald-700 dark:text-emerald-400">
                                        {"$ "}
                                    </span>
                                    {entry.question}
                                </p>
                                <Show when={entry.status !== "loading"}>
                                    <Button
                                        intent="muted"
                                        class="shrink-0"
                                        aria-label="Dismiss answer"
                                        onClick={() => {
                                            props.onDismiss(entry.id)
                                        }}
                                    >
                                        <XIcon class="size-4" />
                                    </Button>
                                </Show>
                            </div>
                            <Switch>
                                <Match when={entry.status === "loading"}>
                                    <output class="mt-3 block font-mono text-xs text-stone-600 dark:text-stone-400">
                                        Reading published pages...
                                    </output>
                                </Match>
                                <Match when={entry.status === "ready" ? entry : undefined}>
                                    {(ready) => (
                                        <>
                                            <Show when={ready().answer.summary}>
                                                {(summary) => (
                                                    <p class="mt-3 max-w-prose text-base/[1.8] text-stone-600 dark:text-stone-400">
                                                        {summary()}
                                                    </p>
                                                )}
                                            </Show>
                                            <Stack render={(list) => <ul {...list} />} class="mt-4">
                                                <For each={ready().answer.sources}>
                                                    {(source) => (
                                                        <RegisterRow
                                                            render={(row) => <li {...row} />}
                                                            href={source.path}
                                                        >
                                                            <RegisterRowTitle>{source.title}</RegisterRowTitle>
                                                            <RegisterRowDescription lines={2}>
                                                                {source.description}
                                                            </RegisterRowDescription>
                                                        </RegisterRow>
                                                    )}
                                                </For>
                                            </Stack>
                                        </>
                                    )}
                                </Match>
                                <Match when={entry.status === "failed" ? entry : undefined}>
                                    {(failed) => (
                                        <>
                                            <p class="mt-3 font-mono text-sm text-stone-700 dark:text-stone-300">
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
                            <Show when={entry.status !== "loading"}>
                                <div class="mt-4 flex items-center justify-end gap-4">
                                    <Show when={!busy()}>
                                        <Button
                                            intent="muted"
                                            onClick={() => {
                                                props.onRetry(entry.id)
                                            }}
                                        >
                                            retry
                                        </Button>
                                    </Show>
                                    <Show when={entry.status === "ready" ? entry : undefined}>
                                        {(ready) => <AmaCopyButton answer={ready().answer} />}
                                    </Show>
                                </div>
                            </Show>
                        </StackRow>
                    )}
                </For>
            </Show>
        </div>
    )
}
