import { ASK_UPSTREAM_RETRY, type AskPageJudgment } from "@core/ask/ask"
import { AskMalformedResponse, AskUpstream } from "@core/ask/errors"
import type { TapePrint } from "@core/ask/tape"
import { TypeSafeClient, noul } from "@typesafe-ai/sdk"
import { Result } from "better-result"
import * as v from "valibot"

const pagePrefix = "page_"

const NoulAnswerSchema = v.object({ noul: v.number() })

const AnswersSchema = v.record(v.string(), v.unknown())

type AskAnswers = v.InferOutput<typeof AnswersSchema>

type GatePage = {
    url: string
    title: string
    description: string
    content: string
}

type GateState = {
    visitor_question: string
    pages: GatePage[]
}

const MAX_GATE_CONTENT = 6000

export function buildGateState(question: string, pages: TapePrint[]): GateState {
    return {
        visitor_question: question,
        pages: pages.map((page) => {
            return {
                url: page.path,
                title: page.title,
                description: page.description,
                content: page.content.slice(0, MAX_GATE_CONTENT),
            }
        }),
    }
}

function relevance(answers: AskAnswers, name: string, pagePath: string): Result<number, AskMalformedResponse> {
    const parsed = v.safeParse(NoulAnswerSchema, answers[name])
    if (!parsed.success) {
        return Result.err(new AskMalformedResponse({ message: "Missing relevance answer", page: pagePath }))
    }
    return Result.ok(parsed.output.noul)
}

const ResponseSchema = v.object({ answers: AnswersSchema })

export function parseJudgment(response: unknown, pages: TapePrint[]): Result<AskPageJudgment, AskMalformedResponse> {
    return Result.gen(function* () {
        const shaped = v.safeParse(ResponseSchema, response)
        if (!shaped.success) {
            return Result.err(new AskMalformedResponse({ message: "Missing ask answers", page: "" }))
        }
        const answerable = v.safeParse(NoulAnswerSchema, shaped.output.answers["answerable"])
        if (!answerable.success) {
            return Result.err(new AskMalformedResponse({ message: "Missing answerability answer", page: "" }))
        }
        const pageRelevance = yield* Result.all(
            pages.map((page, index) =>
                relevance(shaped.output.answers, `${pagePrefix}${index}`, page.path).map((probability) => ({
                    page,
                    probability,
                })),
            ),
        )
        return Result.ok({ answerability: answerable.output.noul, pageRelevance })
    })
}

export const judgeWith =
    (apiKey: string) =>
    (
        question: string,
        pages: TapePrint[],
        signal: AbortSignal,
    ): Promise<Result<AskPageJudgment, AskUpstream | AskMalformedResponse>> =>
        Result.gen(async function* () {
            const client = new TypeSafeClient({ apiKey })
            const response = yield* Result.await(
                Result.tryPromise(
                    {
                        try: () => {
                            return client.systemOne(
                                {
                                    state: buildGateState(question, pages),
                                    questions: {
                                        answerable: noul(
                                            "Can the visitor's question be answered from the supplied site content?",
                                            {
                                                true: "The site content states or clearly implies enough information to answer the question.",
                                                false: "The site content does not provide enough information to answer the question.",
                                            },
                                        ),
                                        ...Object.fromEntries(
                                            pages.map((page, index) => [
                                                `${pagePrefix}${index}`,
                                                noul(
                                                    {
                                                        page_url: page.path,
                                                        question:
                                                            "Does the site page with a `url` matching `page_url` contain information that helps answer `visitor_question`?",
                                                    },
                                                    {
                                                        true: "The page contains specific information that supports an answer to the visitor's question.",
                                                        false: "The page is unrelated or does not provide information useful for answering the visitor's question.",
                                                    },
                                                ),
                                            ]),
                                        ),
                                    },
                                },
                                { signal },
                            )
                        },
                        catch: (cause) => new AskUpstream({ message: "Decision gate failed", cause }),
                    },
                    {
                        signal,
                        retry: ASK_UPSTREAM_RETRY,
                    },
                ),
            )
            const judgment = yield* parseJudgment(response, pages)
            return Result.ok(judgment)
        })
