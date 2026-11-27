import type { AskPageJudgment } from "@core/ask/ask"
import { createAsk } from "@core/ask/create-ask"
import { AskTapeBroken, AskUpstream } from "@core/ask/errors"
import { TAPE_VERSION, type TapeFile, type TapePrint } from "@core/ask/tape"
import { createAskTool } from "@features/mcp/ask-tool"
import { Result } from "better-result"
import { describe, expect, it } from "vite-plus/test"

const page: TapePrint = {
    path: "/cv",
    title: "CV",
    description: "Career facts",
    content: "Built a risk engine at Dennemeyer.",
}

const keys = { TYPESAFE_API_KEY: "typesafe", OPENAI_API_KEY: "openai" }

type ToolOptions = {
    env?: unknown
    answerability?: number
    probability?: number | null
    answerFails?: boolean
    tape?: Result<TapeFile, AskTapeBroken>
}

function makeTool(options: ToolOptions = {}) {
    const calls = { answer: 0 }
    const tool = createAskTool(
        createAsk({
            tape: options.tape ?? Result.ok({ version: TAPE_VERSION, sourceHash: "test", prints: [page] }),
            env: options.env ?? keys,
            makeDeps: () => {
                return {
                    judge: () => {
                        const judgment: AskPageJudgment = {
                            answerability: options.answerability ?? 0.95,
                            pageRelevance:
                                options.probability === null
                                    ? []
                                    : [{ page, probability: options.probability ?? 0.99 }],
                        }
                        return Promise.resolve(Result.ok(judgment))
                    },
                    answer: () => {
                        calls.answer += 1
                        if (options.answerFails === true) {
                            return Promise.resolve(Result.err(new AskUpstream({ message: "failed", cause: null })))
                        }
                        return Promise.resolve(Result.ok("Kevin built a risk engine."))
                    },
                }
            },
        }),
    )
    return { tool, calls }
}

describe("the ask tool", () => {
    it("returns the written answer with its sources", async () => {
        const { tool } = makeTool()
        const result = await tool({ question: "What did Kevin build at Dennemeyer?" }, AbortSignal.timeout(1000))
        expect(result.isError).toBeUndefined()
        expect(JSON.parse(result.content[0]?.text ?? "")).toEqual({
            sources: [page],
            summary: "Kevin built a risk engine.",
        })
    })

    it("returns sources alone when summarize is false", async () => {
        const { tool, calls } = makeTool()
        const result = await tool(
            { question: "What did Kevin build at Dennemeyer?", summarize: false },
            AbortSignal.timeout(1000),
        )
        expect(JSON.parse(result.content[0]?.text ?? "")).toEqual({ sources: [page] })
        expect(calls.answer).toBe(0)
    })

    it("reports a deploy without ask keys", async () => {
        const { tool } = makeTool({ env: {} })
        const result = await tool({ question: "Anything" }, AbortSignal.timeout(1000))
        expect(result.isError).toBe(true)
        expect(result.content[0]?.text).toMatch(/not configured/)
    })

    it("reports a question nothing published answers", async () => {
        const { tool } = makeTool({ probability: null })
        const result = await tool({ question: "Anything" }, AbortSignal.timeout(1000))
        expect(result.isError).toBe(true)
        expect(result.content[0]?.text).toMatch(/Nothing published here answers that/)
    })

    it("reports an upstream failure", async () => {
        const { tool } = makeTool({ answerFails: true })
        const result = await tool({ question: "Anything" }, AbortSignal.timeout(1000))
        expect(result.isError).toBe(true)
        expect(result.content[0]?.text).toMatch(/retry once/)
    })

    it("reports a broken tape instead of answering from nothing", async () => {
        const { tool } = makeTool({ tape: Result.err(new AskTapeBroken({ message: "bad tape" })) })
        const result = await tool({ question: "Anything" }, AbortSignal.timeout(1000))
        expect(result.isError).toBe(true)
        expect(result.content[0]?.text).toMatch(/failed to load/)
    })
})
