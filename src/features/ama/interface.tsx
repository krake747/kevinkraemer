import { ASK_QUESTION_MAX_LENGTH } from "@core/ask/request"
import { askSite, AmaError, type AmaFailure } from "@features/ama/client"
import { AmaTopics } from "@features/ama/topics"
import { AmaTranscript, type AmaEntry } from "@features/ama/transcript"
import { DisclosureRow, DisclosureRowBody, DisclosureRowSummary } from "@pattern/disclosure-row"
import { RegisterWithRail, RegisterWithRailMain, RegisterWithRailRail } from "@pattern/register"
import { DocumentSection, PanelLabel, SectionHeading } from "@pattern/section"
import { createMediaQuery } from "@solid-primitives/media"
import { useSearchParams } from "@solidjs/router"
import { Button } from "@ui/button"
import { Input, InputPrompt } from "@ui/input"
import { Show, createEffect, createSignal } from "solid-js"

function canAsk(question: string, busy: boolean): boolean {
    if (busy) {
        return false
    }
    return question.length > 0 && question.length <= ASK_QUESTION_MAX_LENGTH
}

function toFailure(error: unknown): AmaFailure {
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
    const [askedFromUrl, setAskedFromUrl] = createSignal<string | undefined>(undefined)
    const controllers = new Map<number, AbortController>()
    const busy = (): boolean => entries().some((entry) => entry.status === "loading")
    const prefersReducedMotion = createMediaQuery("(prefers-reduced-motion: reduce)")
    function submitTopic(question: string): void {
        void submit(question)
    }

    function revealEntry(id: number): void {
        requestAnimationFrame(() => {
            const target = document.querySelector(`[data-ama-entry="${id}"]`)
            if (!(target instanceof HTMLElement)) {
                return
            }
            target.focus({ preventScroll: true })
            const rect = target.getBoundingClientRect()
            if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
                return
            }
            target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "nearest" })
        })
    }

    async function runAsk(id: number, question: string, scroll: boolean): Promise<void> {
        const controller = new AbortController()
        controllers.set(id, controller)
        try {
            const answer = await askSite(question, controller.signal)
            setEntries((current) => replaceEntry(current, { id, question, status: "ready", answer }))
        } catch (error) {
            if (controller.signal.aborted) {
                return
            }
            const failure = toFailure(error)
            setEntries((current) =>
                replaceEntry(current, { id, question, status: "failed", detail: failure.detail, hint: failure.hint }),
            )
        } finally {
            controllers.delete(id)
            if (!controller.signal.aborted && scroll) {
                revealEntry(id)
            }
        }
    }

    function nextEntryId(): number {
        return Math.max(0, ...entries().map((entry) => entry.id)) + 1
    }

    async function submit(raw: string, scroll = true): Promise<void> {
        const question = raw.trim()
        if (!canAsk(question, busy())) {
            return
        }
        const id = nextEntryId()
        setEntries((current) => [...current, { id, question, status: "loading" }])
        setInput("")
        setAskedFromUrl(question)
        setSearchParams({ q: question }, { replace: true })
        await runAsk(id, question, scroll)
    }

    function askFromUrl(question: string): void {
        if (question.length > ASK_QUESTION_MAX_LENGTH) {
            const id = nextEntryId()
            setEntries((current) => [
                ...current,
                {
                    id,
                    question,
                    status: "failed",
                    detail: `That question runs past ${ASK_QUESTION_MAX_LENGTH} characters.`,
                    hint: "Shorten it and ask again.",
                },
            ])
            return
        }
        void submit(question, false)
    }

    function retry(id: number): void {
        if (busy()) {
            return
        }
        const entry = entries().find((candidate) => candidate.id === id)
        if (entry === undefined || entry.status === "loading") {
            return
        }
        setEntries((current) => replaceEntry(current, { id, question: entry.question, status: "loading" }))
        setAskedFromUrl(entry.question)
        setSearchParams({ q: entry.question }, { replace: true })
        void runAsk(id, entry.question, true)
    }

    function dismiss(id: number): void {
        controllers.get(id)?.abort()
        controllers.delete(id)
        const next = entries().filter((candidate) => candidate.id !== id)
        setEntries(next)
        const last = next[next.length - 1]
        setAskedFromUrl(last?.question)
        setSearchParams({ q: last?.question }, { replace: true })
    }

    function clear(): void {
        for (const controller of controllers.values()) {
            controller.abort()
        }
        controllers.clear()
        setEntries([])
        setSearchParams({ q: undefined }, { replace: true })
    }

    createEffect(
        () => initialQuestion(searchParams),
        (current) => {
            if (current === undefined || current === askedFromUrl()) {
                return
            }
            setAskedFromUrl(current)
            if (busy()) {
                return
            }
            setInput(current)
            askFromUrl(current)
        },
    )

    return (
        <RegisterWithRail>
            <RegisterWithRailMain>
                <div class="flex flex-col gap-10">
                    <DocumentSection aria-labelledby="ama-answers-heading" aria-busy={busy() ? "true" : undefined}>
                        <SectionHeading id="ama-answers-heading">answers</SectionHeading>
                        <AmaTranscript entries={entries()} onRetry={retry} onDismiss={dismiss} />
                    </DocumentSection>
                    <div class="lg:hidden">
                        <DisclosureRow>
                            <DisclosureRowSummary>
                                <span class="group-open:hidden">+ questions</span>
                                <span class="hidden group-open:inline">− questions</span>
                            </DisclosureRowSummary>
                            <DisclosureRowBody>
                                <AmaTopics busy={busy()} onSelect={submitTopic} />
                            </DisclosureRowBody>
                        </DisclosureRow>
                    </div>
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
                                    placeholder="Ask the site..."
                                    aria-label="Your question"
                                    autocomplete="off"
                                    spellcheck={false}
                                    maxlength={ASK_QUESTION_MAX_LENGTH}
                                >
                                    <InputPrompt />
                                </Input>
                                <div class="flex items-center justify-end gap-3 sm:contents">
                                    <Show when={entries().length > 0}>
                                        <Button class="shrink-0" onClick={clear}>
                                            clear
                                        </Button>
                                    </Show>
                                    <button
                                        type="submit"
                                        disabled={busy()}
                                        class="hit-area-x-2 hit-area-y-3.5 shrink-0 font-mono text-xs text-emerald-800 transition-[color,background-color,border-color,scale] duration-150 ease-out-quart hover:text-emerald-700 active:scale-97 disabled:opacity-50 dark:text-emerald-400 dark:hover:text-emerald-300"
                                    >
                                        <Show when={busy()} fallback="ask">
                                            asking...
                                        </Show>
                                    </button>
                                </div>
                            </form>
                        </search>
                    </DocumentSection>
                </div>
            </RegisterWithRailMain>
            <RegisterWithRailRail labelledby="ama-questions-label">
                <div>
                    <PanelLabel id="ama-questions-label">questions</PanelLabel>
                    <AmaTopics busy={busy()} onSelect={submitTopic} />
                </div>
            </RegisterWithRailRail>
        </RegisterWithRail>
    )
}
