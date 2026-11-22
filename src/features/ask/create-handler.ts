import type { Ask } from "@core/ask/create-ask"
import { askProblem, defectProblem, malformedBodyProblem } from "@core/ask/problem"
import { apiVersion } from "@core/site/api-version"
import { problemResponse } from "@core/site/problem"
import { Panic } from "better-result"

const ASK_METHODS = ["GET", "POST", "OPTIONS"]

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "API-Version": apiVersion,
    "Accept-Query": "application/json",
}

const jsonHeaders = {
    "Content-Type": "application/json; charset=utf-8",
    ...corsHeaders,
}

const FALSE_TOKENS = new Set(["false", "0"])
const TRUE_TOKENS = new Set(["true", "1"])

type RequestInput = { kind: "parsed"; value: unknown } | { kind: "malformed" }

function parseBodyText(body: string): RequestInput {
    if (body.length === 0) {
        return { kind: "parsed", value: null }
    }
    try {
        const parsed: unknown = JSON.parse(body)
        return { kind: "parsed", value: parsed }
    } catch {
        return { kind: "malformed" }
    }
}

function readPostInput(request: Request): Promise<RequestInput> {
    return request.text().then(parseBodyText)
}

function parseSummarizeToken(summarize: string | null): boolean | string {
    if (summarize === null || TRUE_TOKENS.has(summarize)) {
        return true
    }
    if (FALSE_TOKENS.has(summarize)) {
        return false
    }
    return summarize
}

function readGetInput(request: Request): RequestInput {
    const params = new URL(request.url).searchParams
    return {
        kind: "parsed",
        value: {
            question: params.get("question") ?? undefined,
            summarize: parseSummarizeToken(params.get("summarize")),
        },
    }
}

async function readInput(request: Request): Promise<RequestInput> {
    return request.method === "POST" ? readPostInput(request) : readGetInput(request)
}

export function createAskHandler(ask: Ask): (request: Request) => Promise<Response> {
    return async (request) => {
        if (request.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: {
                    ...jsonHeaders,
                    "Access-Control-Allow-Methods": ASK_METHODS.join(", "),
                    "Access-Control-Allow-Headers": "Content-Type, API-Version",
                },
            })
        }

        if (!ASK_METHODS.includes(request.method)) {
            return problemResponse(
                {
                    status: 405,
                    code: "METHOD_NOT_ALLOWED",
                    detail: `Use one of: ${ASK_METHODS.join(", ")}.`,
                    hint: "Send a question to /ask with GET or POST.",
                },
                { ...corsHeaders, Allow: ASK_METHODS.join(", ") },
            )
        }

        const input = await readInput(request)
        if (input.kind === "malformed") {
            return problemResponse(malformedBodyProblem(), corsHeaders)
        }

        try {
            const result = await ask(input.value, AbortSignal.timeout(25_000))

            return result.match({
                ok: (answer) => Response.json(answer, { headers: jsonHeaders }),
                err: (error) => problemResponse(askProblem(error), corsHeaders),
            })
        } catch (error) {
            if (!Panic.is(error)) {
                throw error
            }
            console.error("ask defect", error.cause)
            return problemResponse(defectProblem(), corsHeaders)
        }
    }
}
