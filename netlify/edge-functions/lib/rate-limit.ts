import { problemResponse } from "../../../src/core/site/problem.ts"

const RATE_LIMIT_WINDOW_MS = 60_000
export const RATE_LIMIT_MAX_REQUESTS = 600

type RateLimitDecision = {
    limited: boolean
    limit: number
    remaining: number
    reset: number
    retryAfter: number
}

const hitsByIp = new Map<string, number[]>()

export function resetRateLimits(): void {
    hitsByIp.clear()
}

export function checkRateLimit(clientIp: string, now: number = Date.now()): RateLimitDecision {
    const timestamps = (hitsByIp.get(clientIp) ?? []).filter((timestamp) => timestamp > now - RATE_LIMIT_WINDOW_MS)
    const limited = timestamps.length >= RATE_LIMIT_MAX_REQUESTS
    if (!limited) {
        timestamps.push(now)
    }
    if (timestamps.length === 0) {
        hitsByIp.delete(clientIp)
    } else {
        hitsByIp.set(clientIp, timestamps)
    }
    const oldest = timestamps[0] ?? now
    const reset = Math.ceil((oldest + RATE_LIMIT_WINDOW_MS - now) / 1000)
    return {
        limited,
        limit: RATE_LIMIT_MAX_REQUESTS,
        remaining: limited ? 0 : RATE_LIMIT_MAX_REQUESTS - timestamps.length,
        reset: Math.max(reset, 0),
        retryAfter: limited ? Math.max(reset, 1) : 0,
    }
}

export function rateLimitHeaders(decision: RateLimitDecision): Record<string, string> {
    const headers: Record<string, string> = {
        "RateLimit-Limit": String(decision.limit),
        "RateLimit-Remaining": String(decision.remaining),
        "RateLimit-Reset": String(decision.reset),
    }
    if (decision.limited) {
        headers["Retry-After"] = String(decision.retryAfter)
    }
    return headers
}

export function rateLimitedResponse(retryAfter: number): Response {
    return problemResponse(
        {
            status: 429,
            code: "RATE_LIMITED",
            detail: "Too many requests from this address.",
            hint: "Wait before retrying, cache Vary-aware, or prefer /llms-full.txt and /rss.xml over polling pages.",
        },
        { "Retry-After": String(retryAfter) },
    )
}
