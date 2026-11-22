import { apiVersion } from "./api-version.ts"

const PROBLEM_TITLES = {
    400: "Bad Request",
    404: "Not Found",
    405: "Method Not Allowed",
    429: "Too Many Requests",
    500: "Internal Server Error",
    502: "Bad Gateway",
    503: "Service Unavailable",
} as const

export type ProblemStatus = keyof typeof PROBLEM_TITLES

export const PROBLEM_CODES = [
    "ASK_UNAVAILABLE",
    "INTERNAL_ERROR",
    "INVALID_QUESTION",
    "METHOD_NOT_ALLOWED",
    "NOT_FOUND",
    "RATE_LIMITED",
    "UPSTREAM_ERROR",
] as const

export type ProblemCode = (typeof PROBLEM_CODES)[number]

export type Problem = {
    status: ProblemStatus
    code: ProblemCode
    detail: string
    hint: string
}

export type ProblemDocument = {
    type: string
    title: string
    status: ProblemStatus
    detail: string
    code: ProblemCode
    hint: string
}

export function problemResponse(problem: Problem, headers: Record<string, string> = {}): Response {
    const body: ProblemDocument = {
        type: `https://httpstatuses.com/${problem.status}`,
        title: PROBLEM_TITLES[problem.status],
        status: problem.status,
        detail: problem.detail,
        code: problem.code,
        hint: problem.hint,
    }
    return new Response(JSON.stringify(body), {
        status: problem.status,
        headers: {
            "Content-Type": "application/problem+json",
            "API-Version": apiVersion,
            ...headers,
        },
    })
}
