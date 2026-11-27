import { AmaAbout } from "@features/ama/about"
import { AMA_QUESTION_MAX_LENGTH, AmaError, askSite } from "@features/ama/client"
import { AmaTopics } from "@features/ama/topics"
import { AmaTranscript, type AmaEntry } from "@features/ama/transcript"
import { DisclosureRow, DisclosureRowBody, DisclosureRowSummary } from "@pattern/disclosure-row"
import { RegisterWithRail, RegisterWithRailMain, RegisterWithRailRail } from "@pattern/register"
import { DocumentSection, PanelLabel, SectionHeading } from "@pattern/section"
import { createMediaQuery } from "@solid-primitives/media"
import { useSearchParams } from "@solidjs/router"
import { Button } from "@ui/button"
import { Input, InputPrompt } from "@ui/input"
import { Show, createSignal, onSettled } from "solid-js"

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
    const prefersReducedMotion = createMediaQuery("(prefers-reduced-motion: reduce)")
    let nextId = 1
    let askedFromUrl = false

    function scrollToEntry(id: number): void {
        requestAnimationFrame(() => {
            const target = document.querySelector(`[data-ama-entry="${id}"]`)
            if (target instanceof HTMLElement) {
                target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" })
            }
        })
    }

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
            scrollToEntry(id)
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
        setSearchParams({ q: question }, { replace: true })
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

    function dismiss(id: number): void {
        const next = entries().filter((candidate) => candidate.id !== id)
        setEntries(next)
        if (next.length === 0) {
            setSearchParams({ q: undefined }, { replace: true })
        }
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
                    <DocumentSection aria-labelledby="ama-answers-heading" aria-busy={pending() ? "true" : "false"}>
                        <SectionHeading id="ama-answers-heading">answers</SectionHeading>
                        <AmaTranscript entries={entries()} pending={pending()} onRetry={retry} onDismiss={dismiss} />
                    </DocumentSection>
                    <div class="lg:hidden">
                        <DisclosureRow>
                            <DisclosureRowSummary>
                                <span class="group-open:hidden">+ topics</span>
                                <span class="hidden group-open:inline">− topics</span>
                            </DisclosureRowSummary>
                            <DisclosureRowBody>
                                <AmaTopics
                                    pending={pending()}
                                    onSelect={(question) => {
                                        void submit(question)
                                    }}
                                />
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
                </div>
            </RegisterWithRailMain>
            <RegisterWithRailRail labelledby="ama-topics-label">
                <div class="flex flex-col gap-4">
                    <div>
                        <PanelLabel id="ama-topics-label">topics</PanelLabel>
                        <AmaTopics
                            pending={pending()}
                            onSelect={(question) => {
                                void submit(question)
                            }}
                        />
                    </div>
                    <AmaAbout />
                </div>
            </RegisterWithRailRail>
        </RegisterWithRail>
    )
}
