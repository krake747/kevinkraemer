import { type AskMalformedResponse, AskUnsupported, type AskUpstream, type AskError } from "@core/ask/errors"
import type { TapePrint } from "@core/ask/tape"
import { isNonEmpty, type NonEmpty } from "@core/non-empty"
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

export const ASK_UPSTREAM_RETRY = { times: 1, delayMs: 1000, backoff: "constant" } as const

export const askSourceExclusions = ["/"]

type RankedSelection = { kind: "supported"; sources: NonEmpty<TapePrint> } | { kind: "unsupported" }

const notExcluded =
    (excludedPaths: string[]) =>
    ({ page }: AskPageJudgment["pageRelevance"][number]): boolean => {
        return !excludedPaths.includes(page.path)
    }

const isRelevant = ({ probability }: AskPageJudgment["pageRelevance"][number]): boolean => {
    return probability > relevanceFloor
}

const byScoreDesc = (
    a: AskPageJudgment["pageRelevance"][number],
    b: AskPageJudgment["pageRelevance"][number],
): number => {
    return b.probability - a.probability
}

const selectPage = ({ page }: AskPageJudgment["pageRelevance"][number]): TapePrint => page

export function rankSources(
    judgment: AskPageJudgment,
    summarize: boolean,
    excludedPaths: string[] = askSourceExclusions,
): RankedSelection {
    const ranked = judgment.pageRelevance.filter(notExcluded(excludedPaths)).filter(isRelevant).toSorted(byScoreDesc)
    const sources = ranked.map(selectPage)
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
