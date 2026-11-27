import type { AskError } from "@core/ask/errors"
import { ASK_QUESTION_MAX_LENGTH } from "@core/ask/request"
import type { Problem } from "@core/site/problem"
import { matchError } from "better-result"

const hint = "Ask about the work, the stack, or the writing."
const upstreamDetail = "Answering failed; retry once, then fall back to /llms.txt."

export function malformedBodyProblem(): Problem {
    return {
        status: 400,
        detail: "The request body is not valid JSON.",
        code: "INVALID_QUESTION",
        hint,
    }
}

export function invalidSummarizeProblem(raw: string): Problem {
    return {
        status: 400,
        detail: `Summarize takes "true", "false", "1", or "0", not ${JSON.stringify(raw)}.`,
        code: "INVALID_QUESTION",
        hint,
    }
}

export function defectProblem(): Problem {
    return {
        status: 500,
        detail: "Answering failed unexpectedly.",
        code: "INTERNAL_ERROR",
        hint: "Retry once; if it persists, use /llms.txt.",
    }
}

export function askProblem(error: AskError): Problem {
    return matchError<AskError, Problem>(error, {
        AskInvalidRequest: () => ({
            status: 400,
            detail: `Provide a question up to ${ASK_QUESTION_MAX_LENGTH} characters as ?question= or {"question"}.`,
            code: "INVALID_QUESTION",
            hint,
        }),
        AskKeysMissing: () => ({
            status: 503,
            detail: "The ask endpoint is not configured on this deploy.",
            code: "ASK_UNAVAILABLE",
            hint,
        }),
        AskTapeBroken: () => ({
            status: 503,
            detail: "The site tape failed to load on this deploy.",
            code: "ASK_UNAVAILABLE",
            hint,
        }),
        AskUnsupported: () => ({
            status: 404,
            detail: "Nothing published here answers that. See /llms.txt for what the site covers.",
            code: "NOT_FOUND",
            hint,
        }),
        AskUpstream: () => ({
            status: 502,
            detail: upstreamDetail,
            code: "UPSTREAM_ERROR",
            hint,
        }),
        AskMalformedResponse: () => ({
            status: 502,
            detail: upstreamDetail,
            code: "UPSTREAM_ERROR",
            hint,
        }),
    })
}
