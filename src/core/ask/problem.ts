import type { AskError } from "@core/ask/errors"
import type { Problem } from "@core/site/problem"
import { matchError } from "better-result"

const hint = "Send a question answered by this site; see /llms.txt and /openapi.json for valid resources."

export function malformedBodyProblem(): Problem {
    return {
        status: 400,
        detail: "The request body is not valid JSON.",
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
            detail: 'Provide a question up to 500 characters as ?question= or {"question"}.',
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
            detail: "The published content does not answer this question. Try /llms.txt or /sitemap-index.xml.",
            code: "NOT_FOUND",
            hint,
        }),
        AskUpstream: () => ({
            status: 502,
            detail: "Answering failed; retry once, then fall back to /llms.txt.",
            code: "UPSTREAM_ERROR",
            hint,
        }),
        AskMalformedResponse: () => ({
            status: 502,
            detail: "Answering failed; retry once, then fall back to /llms.txt.",
            code: "UPSTREAM_ERROR",
            hint,
        }),
    })
}
