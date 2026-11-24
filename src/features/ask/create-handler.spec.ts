import type { AskDeps } from "@core/ask/ask"
import { createAsk } from "@core/ask/create-ask"
import { AskTapeBroken, AskUpstream } from "@core/ask/errors"
import type { AskKeys } from "@core/ask/keys"
import { TAPE_VERSION, type TapeFile, type TapePrint } from "@core/ask/tape"
import { tapeResult } from "@core/ask/tape-data"
import { createAskHandler } from "@features/ask/create-handler"
import { Result } from "better-result"
import * as v from "valibot"
import { describe, expect, it, vi } from "vite-plus/test"

const askResponseSchema = v.object({
    sources: v.array(v.object({ path: v.string() })),
    summary: v.optional(v.string()),
})

function readAskResponse(value: unknown) {
    return v.parse(askResponseSchema, value)
}

const keys = { TYPESAFE_API_KEY: "typesafe", OPENAI_API_KEY: "openai" }

const prints = tapeResult.unwrapOr({ version: TAPE_VERSION, sourceHash: "missing", prints: [] }).prints

function page(path: string): TapePrint {
    const match = prints.find((candidate) => {
        return candidate.path === path
    })
    if (match === undefined) {
        throw new Error(`the generated tape has no ${path} page`)
    }
    return match
}

function get(question?: string, summarize?: string): Request {
    const params = new URLSearchParams()
    if (question !== undefined) {
        params.set("question", question)
    }
    if (summarize !== undefined) {
        params.set("summarize", summarize)
    }
    const query = params.toString()
    return new Request(`https://www.kevinkraemer.com/ask${query === "" ? "" : `?${query}`}`)
}

function post(value: unknown): Request {
    return new Request("https://www.kevinkraemer.com/ask", { method: "POST", body: JSON.stringify(value) })
}

function codeOf(response: Response): Promise<unknown> {
    return response.json().then((body: { code?: unknown }) => {
        return body.code
    })
}

const failingDeps = () => {
    return {
        judge: async () => {
            return Result.err(new AskUpstream({ message: "unreachable", cause: null }))
        },
        answer: async () => {
            return Result.err(new AskUpstream({ message: "unreachable", cause: null }))
        },
    }
}

type HandlerOptions = {
    deps?: (keys: AskKeys) => AskDeps
    env?: unknown
    tape?: Result<TapeFile, AskTapeBroken>
}

function makeHandler(options: HandlerOptions = {}) {
    return createAskHandler(
        createAsk({
            tape: options.tape ?? Result.ok({ version: TAPE_VERSION, sourceHash: "spec", prints }),
            env: options.env ?? keys,
            makeDeps: options.deps ?? failingDeps,
        }),
    )
}

describe("ask handler", () => {
    it("400s when the question is missing", async () => {
        const response = await makeHandler()(get())
        expect(response.status).toBe(400)
        expect(await codeOf(response)).toBe("INVALID_QUESTION")
    })

    it("400s when the question is blank or too long", async () => {
        const handler = makeHandler()
        expect((await handler(get("   "))).status).toBe(400)
        expect((await handler(get("x".repeat(501)))).status).toBe(400)
    })

    it("400s when the body is not JSON, naming the cause", async () => {
        const response = await makeHandler()(
            new Request("https://www.kevinkraemer.com/ask", { method: "POST", body: "{oops" }),
        )
        expect(response.status).toBe(400)
        const body: { code?: unknown; detail?: unknown } = await response.json()
        expect(body.code).toBe("INVALID_QUESTION")
        expect(body.detail).toBe("The request body is not valid JSON.")
    })

    it("400s when summarize is not a boolean token, naming summarize", async () => {
        const response = await makeHandler()(get("experience?", "bogus"))
        expect(response.status).toBe(400)
        const body: { code?: unknown; detail?: unknown } = await response.json()
        expect(body.code).toBe("INVALID_QUESTION")
        expect(body.detail).toBe('Summarize takes "true", "false", "1", or "0", not "bogus".')
    })

    it("accepts a POST JSON body", async () => {
        const handler = makeHandler({
            deps: () => {
                return {
                    judge: async () => {
                        return Result.ok({ answerability: 0.95, pageRelevance: [] })
                    },
                    answer: async () => {
                        return Result.ok("unreachable")
                    },
                }
            },
        })
        const response = await handler(post({ question: "anything?", summarize: false }))
        expect(response.status).toBe(404)
        expect(await codeOf(response)).toBe("NOT_FOUND")
    })

    it("200s sources-only when summarize is false", async () => {
        const handler = makeHandler({
            deps: () => {
                return {
                    judge: async () => {
                        return Result.ok({
                            answerability: 0.4,
                            pageRelevance: [{ page: page("/cv"), probability: 0.95 }],
                        })
                    },
                    answer: async () => {
                        return Result.err(
                            new AskUpstream({ message: "must not synthesize without summarize", cause: null }),
                        )
                    },
                }
            },
        })
        const response = await handler(get("experience?", "false"))
        expect(response.status).toBe(200)
        const payload = readAskResponse(await response.json())
        expect(payload.sources.map((source) => source.path)).toContain("/cv")
        expect(payload.summary).toBeUndefined()
    })

    it("200s with a written answer when summarize is on", async () => {
        const handler = makeHandler({
            deps: () => {
                return {
                    judge: async () => {
                        return Result.ok({
                            answerability: 0.95,
                            pageRelevance: [{ page: page("/cv"), probability: 0.95 }],
                        })
                    },
                    answer: async () => {
                        return Result.ok("Kevin built a risk engine.")
                    },
                }
            },
        })
        const response = await handler(get("What did Kevin build?"))
        expect(response.status).toBe(200)
        expect(readAskResponse(await response.json()).summary).toBe("Kevin built a risk engine.")
    })

    it("503s when keys are not configured", async () => {
        const response = await makeHandler({ env: {} })(get("experience?"))
        expect(response.status).toBe(503)
        expect(await codeOf(response)).toBe("ASK_UNAVAILABLE")
    })

    it("503s when the tape fails to load", async () => {
        const response = await makeHandler({ tape: Result.err(new AskTapeBroken({ message: "bad tape" })) })(
            get("experience?"),
        )
        expect(response.status).toBe(503)
        expect(await codeOf(response)).toBe("ASK_UNAVAILABLE")
    })

    it("502s on upstream failure", async () => {
        const handler = makeHandler({
            deps: () => {
                return {
                    judge: async () => {
                        return Result.err(
                            new AskUpstream({ message: "Decision gate failed", cause: new Error("socket hangup") }),
                        )
                    },
                    answer: async () => {
                        return Result.ok("unreachable")
                    },
                }
            },
        })
        const response = await handler(get("experience?"))
        expect(response.status).toBe(502)
        expect(await codeOf(response)).toBe("UPSTREAM_ERROR")
    })

    it("500s when a defect escapes the pipeline", async () => {
        const logged = vi.spyOn(console, "error").mockImplementation(() => {})
        try {
            const handler = makeHandler({
                deps: () => {
                    return {
                        judge: async () => {
                            throw new Error("gate exploded")
                        },
                        answer: async () => {
                            return Result.ok("unreachable")
                        },
                    }
                },
            })
            const response = await handler(get("experience?"))
            expect(response.status).toBe(500)
            expect(await codeOf(response)).toBe("INTERNAL_ERROR")
            expect(logged).toHaveBeenCalledWith("ask defect", expect.any(Error))
        } finally {
            logged.mockRestore()
        }
    })
})

describe("ask method handling", () => {
    it("answers a preflight with the allowed methods", async () => {
        const response = await makeHandler()(new Request("https://www.kevinkraemer.com/ask", { method: "OPTIONS" }))
        expect(response.status).toBe(204)
        expect(response.headers.get("access-control-allow-methods")).toBe("GET, POST, OPTIONS")
    })

    it("rejects verbs it does not implement with 405 and Allow", async () => {
        const response = await makeHandler()(
            new Request("https://www.kevinkraemer.com/ask", {
                method: "PUT",
                body: JSON.stringify({ question: "anything?" }),
            }),
        )
        expect(response.status).toBe(405)
        expect(response.headers.get("allow")).toBe("GET, POST, OPTIONS")
        expect(await codeOf(response)).toBe("METHOD_NOT_ALLOWED")
    })

    it("advertises the query formats it accepts", async () => {
        const response = await makeHandler()(get("anything?", "false"))
        expect(response.headers.get("accept-query")).toBe("application/json")
    })
})
