import { describe, expect, it } from "vite-plus/test"

import { apiVersion } from "../../../src/core/site/api-version.ts"
import {
    checkRateLimit,
    RATE_LIMIT_MAX_REQUESTS,
    rateLimitedResponse,
    rateLimitHeaders,
    resetRateLimits,
} from "./rate-limit.ts"

describe("the rate limiter", () => {
    it("allows requests under the limit with decreasing remaining", () => {
        resetRateLimits()
        const first = checkRateLimit("10.0.0.1", 1_000)
        expect(first.limited).toBe(false)
        expect(first.limit).toBe(RATE_LIMIT_MAX_REQUESTS)
        expect(first.remaining).toBe(RATE_LIMIT_MAX_REQUESTS - 1)

        const second = checkRateLimit("10.0.0.1", 2_000)
        expect(second.limited).toBe(false)
        expect(second.remaining).toBe(RATE_LIMIT_MAX_REQUESTS - 2)
    })

    it("limits the request past the cap and recovers after the window", () => {
        resetRateLimits()
        let decision = checkRateLimit("10.0.0.2", 0)
        for (let i = 1; i < RATE_LIMIT_MAX_REQUESTS; i++) {
            decision = checkRateLimit("10.0.0.2", i)
        }
        expect(decision.limited).toBe(false)
        expect(decision.remaining).toBe(0)

        const blocked = checkRateLimit("10.0.0.2", RATE_LIMIT_MAX_REQUESTS)
        expect(blocked.limited).toBe(true)
        expect(blocked.remaining).toBe(0)
        expect(blocked.retryAfter).toBeGreaterThan(0)

        const recovered = checkRateLimit("10.0.0.2", 61_000 + RATE_LIMIT_MAX_REQUESTS)
        expect(recovered.limited).toBe(false)
    })

    it("tracks addresses independently", () => {
        resetRateLimits()
        for (let i = 0; i < RATE_LIMIT_MAX_REQUESTS; i++) {
            checkRateLimit("10.0.0.3", i)
        }
        expect(checkRateLimit("10.0.0.3", RATE_LIMIT_MAX_REQUESTS).limited).toBe(true)
        expect(checkRateLimit("10.0.0.4", RATE_LIMIT_MAX_REQUESTS).limited).toBe(false)
    })
})

describe("rate limit headers", () => {
    it("emits RFC RateLimit fields and Retry-After only when limited", () => {
        resetRateLimits()
        const open = rateLimitHeaders(checkRateLimit("10.0.0.5", 0))
        expect(open["RateLimit-Limit"]).toBe(String(RATE_LIMIT_MAX_REQUESTS))
        expect(open["RateLimit-Remaining"]).toBe(String(RATE_LIMIT_MAX_REQUESTS - 1))
        expect(open["Retry-After"]).toBeUndefined()

        for (let i = 1; i <= RATE_LIMIT_MAX_REQUESTS; i++) {
            checkRateLimit("10.0.0.6", i)
        }
        const shut = rateLimitHeaders(checkRateLimit("10.0.0.6", RATE_LIMIT_MAX_REQUESTS + 1))
        expect(shut["RateLimit-Remaining"]).toBe("0")
        expect(Number(shut["Retry-After"])).toBeGreaterThan(0)
    })
})

describe("rate limited responses", () => {
    it("returns a 429 problem+json envelope with Retry-After", async () => {
        const response = rateLimitedResponse(42)
        expect(response.status).toBe(429)
        expect(response.headers.get("Content-Type")).toBe("application/problem+json")
        expect(response.headers.get("API-Version")).toBe(apiVersion)
        expect(response.headers.get("Retry-After")).toBe("42")
        await expect(response.json()).resolves.toEqual({
            type: "https://httpstatuses.com/429",
            title: "Too Many Requests",
            status: 429,
            detail: "Too many requests from this address.",
            code: "RATE_LIMITED",
            hint: expect.stringContaining("/llms-full.txt"),
        })
    })
})
