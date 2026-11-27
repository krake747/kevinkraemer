import { AmaAbout } from "@features/ama/about"
import { AMA_QUESTION_MAX_LENGTH, AmaError, askSite } from "@features/ama/client"
import { AMA_QUESTIONS } from "@features/ama/questions"
import { AmaTranscript, type AmaEntry } from "@features/ama/transcript"
import { RegisterWithRail, RegisterWithRailMain, RegisterWithRailRail } from "@pattern/register"
import { DocumentSection, SectionHeading } from "@pattern/section"
import { StackRow } from "@pattern/stack"
import { useSearchParams } from "@solidjs/router"
import { Button } from "@ui/button"
import { ArrowRightIcon } from "@ui/icon"
import { Input, InputPrompt } from "@ui/input"
import { For, Show, createSignal, onSettled } from "solid-js"

function canAsk(question: string, busy: boolean): boolean {
    if (busy) {
        return false
    }
    return question.length > 0 && question.length <= AMA_QUESTION_MAX_LENGTH
}

function toFailure(error: unknown): { detail: string; hint?: string } {
    if (error instanceof AmaError) {
        return error.failure
    }
    return { detail: "The answer did not arrive. Try again." }
}

function replaceEntry(current: readonly AmaEntry[], entry: AmaEntry): AmaEntry[] {
    return current.map((candidate) => (candidate.id === entry.id ? entry : candidate))
}

function initialQuestion(params: { q?: string | string[] }): string | undefined {
    const raw = Array.isArray(params.q) ? params.q[0] : params.q
    if (raw === undefined || raw.trim().length === 0) {
        return undefined
    }
    return raw
}

export function AmaInterface() {
    const [searchParams, setSearchParams] = useSearchParams<{ q?: string }>()
    const [input, setInput] = createSignal("")
    const [entries, setEntries] = createSignal<AmaEntry[]>([])
    const [pending, setPending] = createSignal(false)
    let nextId = 1
    let askedFromUrl = false

    async function runAsk(id: number, question: string): Promise<void> {
        setPending(true)
        try {
            const answer = await askSite(question)
            setEntries((current) => replaceEntry(current, { id, question, status: "ready", answer }))
        } catch (error) {
            const failure = toFailure(error)
            setEntries((current) =>
                replaceEntry(current, { id, question, status: "failed", detail: failure.detail, hint: failure.hint }),
            )
        } finally {
            setPending(false)
        }
    }

    async function submit(raw: string): Promise<void> {
        const question = raw.trim()
        if (!canAsk(question, pending())) {
            return
        }
        const id = nextId
        nextId += 1
        setEntries((current) => [...current, { id, question, status: "loading" }])
        setInput("")
        setSearchParams({ q: question })
        await runAsk(id, question)
    }

    function retry(id: number): void {
        if (pending()) {
            return
        }
        const entry = entries().find((candidate) => candidate.id === id)
        if (entry === undefined || entry.status === "loading") {
            return
        }
        setEntries((current) => replaceEntry(current, { id, question: entry.question, status: "loading" }))
        void runAsk(id, entry.question)
    }

    function clear(): void {
        setEntries([])
        setSearchParams({ q: undefined }, { replace: true })
    }

    onSettled(() => {
        if (askedFromUrl) {
            return
        }
        askedFromUrl = true
        const first = initialQuestion(searchParams)
        if (first !== undefined) {
            setInput(first)
            void submit(first)
        }
    })

    return (
        <RegisterWithRail>
            <RegisterWithRailMain>
                <div class="flex flex-col gap-10">
                    <DocumentSection aria-labelledby="ama-ask-heading">
                        <SectionHeading id="ama-ask-heading">ask</SectionHeading>
                        <search
                            aria-label="Ask the site"
                            class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3"
                        >
                            <form
                                class="contents"
                                onSubmit={(event) => {
                                    event.preventDefault()
                                    void submit(input())
                                }}
                            >
                                <Input
                                    value={input()}
                                    onInput={(event) => {
                                        setInput(event.currentTarget.value)
                                    }}
                                    placeholder="What do you want to know?"
                                    aria-label="Your question"
                                    autocomplete="off"
                                    spellcheck={false}
                                    maxlength={AMA_QUESTION_MAX_LENGTH}
                                    disabled={pending()}
                                >
                                    <InputPrompt />
                                </Input>
                                <div class="flex items-center justify-end gap-3 sm:contents">
                                    <Show when={entries().length > 0}>
                                        <Button class="shrink-0" onClick={clear}>
                                            clear
                                        </Button>
                                    </Show>
                                    <Button
                                        class="shrink-0 disabled:opacity-50"
                                        intent="quiet"
                                        disabled={pending()}
                                        onClick={() => void submit(input())}
                                    >
                                        {pending() ? "asking..." : "ask"}
                                    </Button>
                                </div>
                            </form>
                        </search>
                    </DocumentSection>
                    <DocumentSection aria-labelledby="ama-answers-heading" aria-busy={pending() ? "true" : "false"}>
                        <SectionHeading id="ama-answers-heading">answers</SectionHeading>
                        <AmaTranscript entries={entries()} pending={pending()} onRetry={retry} />
                    </DocumentSection>
                    <DocumentSection aria-labelledby="ama-topics-heading">
                        <SectionHeading id="ama-topics-heading">topics</SectionHeading>
                        <ul class="flex flex-col gap-2">
                            <For each={AMA_QUESTIONS}>
                                {(suggested) => (
                                    <li>
                                        <StackRow size="compact" interactive>
                                            <button
                                                type="button"
                                                class="group flex w-full items-center justify-between gap-4 text-left disabled:opacity-50"
                                                disabled={pending()}
                                                onClick={() => {
                                                    void submit(suggested)
                                                }}
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
                                            </button>
                                        </StackRow>
                                    </li>
                                )}
                            </For>
                        </ul>
                    </DocumentSection>
                </div>
            </RegisterWithRailMain>
            <RegisterWithRailRail labelledby="ama-about-label">
                <AmaAbout />
            </RegisterWithRailRail>
        </RegisterWithRail>
    )
}
