import { ASK_QUESTION_MAX_LENGTH } from "@core/ask/request"
import { buildTape } from "@core/ask/tape"
import { catalogEntries } from "@core/site/catalog"
import { AMA_QUESTIONS } from "@features/ama/questions"
import { describe, expect, it } from "vite-plus/test"

const STOP = new Set(["what", "with", "this", "that", "your", "about", "from", "they", "them", "then", "there", "tell"])

function tokens(text: string): Set<string> {
    return new Set(
        text
            .toLowerCase()
            .split(/[^a-z0-9]+/)
            .filter((word) => word.length > 3 && !STOP.has(word)),
    )
}

const vocabulary = new Set(
    buildTape(() => "")(catalogEntries).flatMap((print) => [
        ...tokens(`${print.title} ${print.description}`),
        ...print.path.toLowerCase().split(/[^a-z0-9]+/),
    ]),
)

describe("the suggested questions", () => {
    it("names six distinct askable questions", () => {
        expect(new Set(AMA_QUESTIONS).size).toBe(AMA_QUESTIONS.length)
        for (const question of AMA_QUESTIONS) {
            expect(question.trim()).toBe(question)
            expect(question).toMatch(/\S/)
            expect(question.length).toBeLessThanOrEqual(ASK_QUESTION_MAX_LENGTH)
        }
    })

    for (const question of AMA_QUESTIONS) {
        it(`shares vocabulary with the published catalog: ${question}`, () => {
            expect([...tokens(question)].some((word) => vocabulary.has(word))).toBe(true)
        })
    }
})
