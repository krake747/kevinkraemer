import { AskInvalidRequest, AskTapeBroken } from "@core/ask/errors"
import { parseAskRequest, parseTapeFile } from "@core/ask/request"
import { TAPE_VERSION } from "@core/ask/tape"
import { describe, expect, it } from "vite-plus/test"

describe("an ask request", () => {
    it("accepts a trimmed question with an explicit flag", () => {
        const result = parseAskRequest({ question: "  experience? ", summarize: false })
        expect(result.match({ ok: (request) => request, err: () => null })).toEqual({
            question: "experience?",
            summarize: false,
        })
    })

    it("defaults summarize to true", () => {
        const result = parseAskRequest({ question: "experience?" })
        expect(result.match({ ok: (request) => request, err: () => null })).toEqual({
            question: "experience?",
            summarize: true,
        })
    })

    it("rejects missing, blank, overlong, and mistyped input", () => {
        for (const input of [
            {},
            { question: "   " },
            { question: "x".repeat(501) },
            { question: 42 },
            { question: "ok?", summarize: "yes" },
            null,
        ]) {
            const result = parseAskRequest(input)
            expect(result.match({ ok: () => false, err: (error) => AskInvalidRequest.is(error) })).toBe(true)
        }
    })
})

describe("a tape file", () => {
    it("accepts the generated tape shape", () => {
        const prints = [{ path: "/cv", title: "CV", description: "Career facts", content: "Career facts content" }]
        const tape = { version: TAPE_VERSION, sourceHash: "abc", prints }
        const result = parseTapeFile(tape)
        expect(result.match({ ok: (parsed) => parsed, err: () => null })).toEqual(tape)
    })

    it("rejects corrupt or mistyped tape files", () => {
        for (const input of [
            null,
            { version: TAPE_VERSION, sourceHash: "abc" },
            { version: TAPE_VERSION, sourceHash: "abc", prints: [{ path: "/cv" }] },
            { version: TAPE_VERSION, sourceHash: "abc", prints: [{ path: "/cv", title: "CV", description: "d" }] },
        ]) {
            const result = parseTapeFile(input)
            expect(result.match({ ok: () => false, err: (error) => AskTapeBroken.is(error) })).toBe(true)
        }
    })

    it("names the version skew when the tape is older or newer", () => {
        const result = parseTapeFile({ version: TAPE_VERSION + 1, sourceHash: "abc", prints: [] })
        expect(result.match({ ok: () => "", err: (error) => error.message })).toContain(
            `Tape version ${TAPE_VERSION + 1}, expected ${TAPE_VERSION}`,
        )
    })
})
