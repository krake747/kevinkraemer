import { askSourceExclusions, rankSources, runAsk, type AskDeps } from "@core/ask/ask"
import { AskUnsupported, AskUpstream } from "@core/ask/errors"
import type { TapePrint } from "@core/ask/tape"
import { Result } from "better-result"
import { describe, expect, it } from "vite-plus/test"

function makePage(path: string): TapePrint {
    return { path, title: path, description: `${path} description`, content: `${path} content` }
}

function hit(pages: TapePrint[], probability = 0.95) {
    return { answerability: 0.95, pageRelevance: pages.map((page) => ({ page, probability })) }
}

describe("source ranking", () => {
    it("keeps prints above the relevance floor, sorted best first", () => {
        const [cv, logs, about] = [makePage("/cv"), makePage("/logs"), makePage("/about")]
        const judgment = {
            answerability: 0.95,
            pageRelevance: [
                { page: cv, probability: 0.9 },
                { page: logs, probability: 0.99 },
                { page: about, probability: 0.5 },
            ],
        }
        const selection = rankSources(judgment, true)
        expect(selection).toEqual({ kind: "supported", sources: [logs, cv] })
    })

    it("excludes configured paths", () => {
        const judgment = {
            answerability: 0.95,
            pageRelevance: [{ page: makePage("/"), probability: 0.99 }],
        }
        expect(askSourceExclusions).toContain("/")
        expect(rankSources(judgment, true)).toEqual({ kind: "unsupported" })
    })

    it("withholds summary when answerability is at the floor", () => {
        const judgment = {
            answerability: 0.85,
            pageRelevance: [{ page: makePage("/cv"), probability: 0.95 }],
        }
        expect(rankSources(judgment, true)).toEqual({ kind: "unsupported" })
        expect(rankSources(judgment, false).kind).toBe("supported")
    })

    it("unsupported when nothing clears the floor", () => {
        const judgment = {
            answerability: 0.95,
            pageRelevance: [{ page: makePage("/cv"), probability: 0.84 }],
        }
        expect(rankSources(judgment, false)).toEqual({ kind: "unsupported" })
    })
})

describe("asking a question", () => {
    it("returns sources without summary when summarize is false", async () => {
        const pages = [makePage("/cv")]
        let answerCalled = false
        const deps: AskDeps = {
            judge: async () => Result.ok({ ...hit(pages), answerability: 0.4 }),
            answer: async () => {
                answerCalled = true
                return Result.err(new AskUpstream({ message: "must not synthesize without summarize", cause: null }))
            },
        }
        const result = await runAsk(deps)("experience?", false, pages, new AbortController().signal)
        expect(result.match({ ok: (answer) => answer, err: () => null })).toEqual({ sources: pages })
        expect(answerCalled).toBe(false)
    })

    it("returns sources plus summary when supported", async () => {
        const pages = [makePage("/cv")]
        const deps: AskDeps = {
            judge: async () => Result.ok(hit(pages)),
            answer: async () => Result.ok("Kevin is a full-stack developer."),
        }
        const result = await runAsk(deps)("experience?", true, pages, new AbortController().signal)
        expect(result.match({ ok: (answer) => answer, err: () => null })).toEqual({
            sources: pages,
            summary: "Kevin is a full-stack developer.",
        })
    })

    it("returns AskUnsupported when nothing clears the floor", async () => {
        const deps: AskDeps = {
            judge: async () => Result.ok({ answerability: 0.1, pageRelevance: [] }),
            answer: async () => Result.ok("unreachable"),
        }
        const result = await runAsk(deps)("lottery numbers?", true, [makePage("/cv")], new AbortController().signal)
        expect(result.match({ ok: () => false, err: (error) => error instanceof AskUnsupported })).toBe(true)
    })

    it("returns the judge error without wrapping", async () => {
        const cause = new AskUpstream({ message: "Decision gate failed", cause: new Error("socket hangup") })
        const deps: AskDeps = {
            judge: async () => Result.err(cause),
            answer: async () => Result.ok("unreachable"),
        }
        const result = await runAsk(deps)("experience?", true, [makePage("/cv")], new AbortController().signal)
        expect(result.match({ ok: () => null, err: (error) => error })).toBe(cause)
    })

    it("returns the answer error without wrapping", async () => {
        const pages = [makePage("/cv")]
        const cause = new AskUpstream({ message: "Answer synthesis failed", cause: new Error("overloaded") })
        const deps: AskDeps = {
            judge: async () => Result.ok(hit(pages)),
            answer: async () => Result.err(cause),
        }
        const result = await runAsk(deps)("experience?", true, pages, new AbortController().signal)
        expect(result.match({ ok: () => null, err: (error) => error })).toBe(cause)
    })
})
