import { AskMalformedResponse } from "@core/ask/errors"
import { buildGateState, parseJudgment } from "@core/ask/gate"
import type { TapePrint } from "@core/ask/tape"
import { describe, expect, it } from "vite-plus/test"

const pages: TapePrint[] = [
    { path: "/cv", title: "CV", description: "Career facts", content: "Career facts content" },
    { path: "/logs", title: "Logs", description: "Writing index", content: "Writing index content" },
]

function answers(answerability: number, ...probabilities: number[]) {
    return {
        model: "test",
        usage: { input_tokens: 1, output_tokens: 1 },
        answers: Object.fromEntries([
            ["answerable", { type: "noul", noul: answerability }],
            ...probabilities.map((probability, index) => [`page_${index}`, { type: "noul", noul: probability }]),
        ]),
    }
}

describe("relevance judgments", () => {
    it("ranks pages by relevance", () => {
        const result = parseJudgment(answers(0.95, 0.9, 0.99), pages)
        expect(result.match({ ok: (judgment) => judgment, err: () => null })).toEqual({
            answerability: 0.95,
            pageRelevance: [
                { page: pages[0], probability: 0.9 },
                { page: pages[1], probability: 0.99 },
            ],
        })
    })

    it("reports a missing answers envelope", () => {
        const result = parseJudgment({ model: "test" }, pages)
        expect(result.match({ ok: () => false, err: (error) => AskMalformedResponse.is(error) })).toBe(true)
    })

    it("reports a missing answerability answer", () => {
        const result = parseJudgment({ answers: { page_0: { type: "noul", noul: 0.9 } } }, pages)
        expect(result.match({ ok: () => false, err: (error) => AskMalformedResponse.is(error) })).toBe(true)
    })

    it("reports the page missing its relevance answer", () => {
        const result = parseJudgment(answers(0.95, 0.9), pages)
        expect(
            result.match({
                ok: () => null,
                err: (error) => (error instanceof AskMalformedResponse ? error.page : null),
            }),
        ).toBe("/logs")
    })
})

describe("the gate prompt", () => {
    it("sends page content so relevance is judged on more than titles", () => {
        const state = buildGateState("Where can I reach Kevin?", pages)
        expect(state.visitor_question).toBe("Where can I reach Kevin?")
        expect(state.pages.map((page) => page.url)).toEqual(["/cv", "/logs"])
        expect(state.pages[0]?.content).toBe("Career facts content")
    })

    it("caps content so one long page cannot crowd out the rest", () => {
        const longPages = [{ path: "/logs", title: "Logs", description: "Writing", content: "x".repeat(9000) }]
        const [page] = buildGateState("anything", longPages).pages
        expect(page?.content.length).toBe(6000)
    })
})
