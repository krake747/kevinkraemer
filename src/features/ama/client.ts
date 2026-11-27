import { TapePrintSchema } from "@core/ask/tape"
import * as v from "valibot"

const amaSourceSchema = v.pick(TapePrintSchema, ["path", "title", "description"])

const amaAnswerSchema = v.object({
    sources: v.array(amaSourceSchema),
    summary: v.optional(v.string()),
})

export type AmaAnswer = v.InferOutput<typeof amaAnswerSchema>

export type AmaFailure = {
    detail: string
    hint?: string
}

export class AmaError extends Error {
    failure: AmaFailure

    constructor(failure: AmaFailure) {
        super(failure.detail)
        this.failure = failure
    }
}

function readFailure(body: unknown): AmaFailure {
    const parsed = v.safeParse(v.object({ detail: v.optional(v.string()), hint: v.optional(v.string()) }), body)
    if (parsed.success && parsed.output.detail !== undefined && parsed.output.detail.length > 0) {
        return { detail: parsed.output.detail, hint: parsed.output.hint }
    }
    return { detail: "The answer did not arrive. Try again." }
}

export async function askSite(question: string, signal?: AbortSignal): Promise<AmaAnswer> {
    const params = new URLSearchParams({ question, summarize: "true" })
    let response: Response
    try {
        response = await fetch(`/ask?${params.toString()}`, {
            headers: { Accept: "application/json" },
            signal,
        })
    } catch (error) {
        if (signal?.aborted === true) {
            throw error
        }
        throw new AmaError({ detail: "The answer did not arrive. Try again." })
    }
    const body: unknown = await response.json().catch(() => undefined)
    if (!response.ok) {
        throw new AmaError(readFailure(body))
    }
    const parsed = v.safeParse(amaAnswerSchema, body)
    if (!parsed.success) {
        throw new AmaError({ detail: "The answer had an unexpected shape. Try again." })
    }
    return parsed.output
}
