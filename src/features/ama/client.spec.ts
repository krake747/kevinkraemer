import { AmaError, askSite } from "@features/ama/client"
import { describe, expect, it, vi } from "vite-plus/test"

const answer = {
    sources: [{ path: "/about", title: "About", description: "The story so far." }],
    summary: "Kevin automates the boring parts first.",
}

function jsonResponse(body: unknown, status: number): Response {
    return new Response(JSON.stringify(body), { status })
}

describe("asking the site", () => {
    it("returns sources with the written answer", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn(async () => jsonResponse(answer, 200)),
        )
        try {
            const result = await askSite("What stack powers this site?")
            expect(result.summary).toBe("Kevin automates the boring parts first.")
            expect(result.sources.map((source) => source.path)).toEqual(["/about"])
        } finally {
            vi.unstubAllGlobals()
        }
    })

    it("surfaces the problem detail when the question is rejected", async () => {
        const problem = { detail: "Question is blank.", hint: "Ask in plain words." }
        vi.stubGlobal(
            "fetch",
            vi.fn(async () => jsonResponse(problem, 400)),
        )
        try {
            const failure = await askSite("   ").then(
                () => undefined,
                (error: unknown) => error,
            )
            expect(failure).toBeInstanceOf(AmaError)
            expect(failure instanceof AmaError ? failure.failure.detail : undefined).toBe("Question is blank.")
        } finally {
            vi.unstubAllGlobals()
        }
    })

    it("rejects an answer with an unexpected shape", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn(async () => jsonResponse({ nope: true }, 200)),
        )
        try {
            await expect(askSite("What stack powers this site?")).rejects.toBeInstanceOf(AmaError)
        } finally {
            vi.unstubAllGlobals()
        }
    })

    it("falls back when the network fails", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn(async () => {
                throw new TypeError("offline")
            }),
        )
        try {
            const failure = await askSite("What stack powers this site?").then(
                () => undefined,
                (error: unknown) => error,
            )
            expect(failure).toBeInstanceOf(AmaError)
            expect(failure instanceof AmaError ? failure.failure.detail : undefined).toBe(
                "The answer did not arrive. Try again.",
            )
        } finally {
            vi.unstubAllGlobals()
        }
    })

    it("falls back on a non-json error body", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn(async () => new Response("boom", { status: 500 })),
        )
        try {
            const failure = await askSite("What stack powers this site?").then(
                () => undefined,
                (error: unknown) => error,
            )
            expect(failure).toBeInstanceOf(AmaError)
            expect(failure instanceof AmaError ? failure.failure.detail : undefined).toBe(
                "The answer did not arrive. Try again.",
            )
        } finally {
            vi.unstubAllGlobals()
        }
    })
})
