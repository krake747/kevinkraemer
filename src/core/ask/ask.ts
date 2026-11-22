import { AskMalformedResponse, AskUnsupported, AskUpstream, type AskError } from "@core/ask/errors"
import type { TapePrint } from "@core/ask/tape"
import { Result } from "better-result"

export type AskPageJudgment = {
    answerability: number
    pageRelevance: { page: TapePrint; probability: number }[]
}

export type AskAnswer = {
    sources: TapePrint[]
    summary?: string
}

const relevanceFloor = 0.85
const answerabilityFloor = 0.85

export const askSourceExclusions = ["/"]

type RankedSelection = { kind: "supported"; sources: [TapePrint, ...TapePrint[]] } | { kind: "unsupported" }

const isNonEmpty = <T>(items: T[]): items is [T, ...T[]] => items.length > 0

export function rankSources(
    judgment: AskPageJudgment,
    summarize: boolean,
    excludedPaths: string[] = askSourceExclusions,
): RankedSelection {
    const ranked = judgment.pageRelevance
        .filter(({ page }) => {
            return !excludedPaths.includes(page.path)
        })
        .filter(({ probability }) => {
            return probability > relevanceFloor
        })
        .toSorted((a, b) => {
            return b.probability - a.probability
        })
    const sources = ranked.map(({ page }) => {
        return page
    })
    if (!isNonEmpty(sources) || (summarize && judgment.answerability <= answerabilityFloor)) {
        return { kind: "unsupported" }
    }
    return { kind: "supported", sources }
}

export type AskDeps = {
    judge: (
        question: string,
        pages: TapePrint[],
        signal: AbortSignal,
    ) => Promise<Result<AskPageJudgment, AskUpstream | AskMalformedResponse>>
    answer: (question: string, sources: TapePrint[], signal: AbortSignal) => Promise<Result<string, AskUpstream>>
}

function selectSources(judgment: AskPageJudgment, summarize: boolean): Result<TapePrint[], AskUnsupported> {
    const selection = rankSources(judgment, summarize)
    if (selection.kind === "unsupported") {
        return Result.err(new AskUnsupported({ message: "The published content does not answer this question" }))
    }
    return Result.ok(selection.sources)
}

export const runAsk =
    (deps: AskDeps) =>
    (
        question: string,
        summarize: boolean,
        pages: TapePrint[],
        signal: AbortSignal,
    ): Promise<Result<AskAnswer, AskError>> =>
        Result.gen(async function* () {
            const judgment = yield* Result.await(deps.judge(question, pages, signal))
            const sources = yield* selectSources(judgment, summarize)
            if (!summarize) {
                return Result.ok({ sources })
            }
            const summary = yield* Result.await(deps.answer(question, sources, signal))
            return Result.ok({ sources, summary })
        })
