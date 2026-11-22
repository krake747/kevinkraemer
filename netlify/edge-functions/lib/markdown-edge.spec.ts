import { afterEach, describe, expect, it, vi } from "vite-plus/test"

import markdown from "../markdown.ts"
import { resetRateLimits, RATE_LIMIT_MAX_REQUESTS } from "./rate-limit.ts"

afterEach(() => {
    resetRateLimits()
    vi.unstubAllGlobals()
})

describe("markdown edge function JSON errors", () => {
    it("returns an RFC 9457 problem+json 404 for a missing page", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(new Response("Not found", { status: 404 }))
        const next = vi.fn<() => Promise<Response>>()

        const response = await markdown(
            new Request("https://www.kevinkraemer.com/missing-page", {
                headers: { Accept: "application/json" },
            }),
            { next },
        )

        expect(response.status).toBe(404)
        expect(response.headers.get("Content-Type")).toBe("application/problem+json")
        expect(response.headers.get("Vary")).toBe("Accept, Accept-Encoding")
        await expect(response.json()).resolves.toMatchObject({
            type: "https://httpstatuses.com/404",
            title: "Not Found",
            status: 404,
            code: "NOT_FOUND",
        })
        expect(next).not.toHaveBeenCalled()
    })

    it("returns a JSON page descriptor for an existing page", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
            new Response(`<head><title>CV</title><meta name="description" content="Career facts." /></head>`, {
                status: 200,
            }),
        )
        const next = vi.fn<() => Promise<Response>>()

        const response = await markdown(
            new Request("https://www.kevinkraemer.com/cv", {
                headers: { Accept: "application/json" },
            }),
            { next, ip: "10.9.9.9" },
        )

        expect(response.status).toBe(200)
        expect(response.headers.get("Content-Type")).toBe("application/json; charset=utf-8")
        expect(response.headers.get("RateLimit-Limit")).toBe(String(RATE_LIMIT_MAX_REQUESTS))
        await expect(response.json()).resolves.toMatchObject({
            url: "https://www.kevinkraemer.com/cv",
            title: "CV",
            apiVersion: "1.0.0",
        })
    })

    it("serves converted markdown for a .md extension URL", async () => {
        vi.spyOn(globalThis, "fetch")
            .mockResolvedValueOnce(new Response("Not found", { status: 404 }))
            .mockResolvedValueOnce(new Response("<h1>Something Visible</h1><p>Hello world.</p>", { status: 200 }))
        const next = vi.fn<() => Promise<Response>>(async () => new Response("ok"))

        const response = await markdown(new Request("https://www.kevinkraemer.com/logs/something-visible.md"), {
            next,
            ip: "10.7.7.7",
        })

        expect(response.status).toBe(200)
        expect(response.headers.get("Content-Type")).toBe("text/markdown; charset=utf-8")
        expect(response.headers.get("API-Version")).toBe("1.0.0")
        await expect(response.text()).resolves.toContain("Something Visible")
        expect(next).not.toHaveBeenCalled()
    })

    it("serves the authored markdown file instead of converting the page", async () => {
        const authored = '---\ntitle: "Something Visible"\n---\n\nAuthored body.'
        vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
            new Response(authored, { status: 200, headers: { "Content-Type": "text/markdown" } }),
        )

        const response = await markdown(new Request("https://www.kevinkraemer.com/logs/something-visible.md"), {
            next: vi.fn<() => Promise<Response>>(async () => new Response("ok")),
            ip: "10.6.6.6",
        })

        await expect(response.text()).resolves.toBe(authored)
        expect(globalThis.fetch).toHaveBeenCalledTimes(1)
    })

    it("passes an internal source read through untouched", async () => {
        const next = vi.fn<() => Promise<Response>>(async () => new Response("---\ntitle: Authored\n---"))
        const response = await markdown(
            new Request("https://www.kevinkraemer.com/logs/something-visible.md", {
                headers: { "x-markdown-source": "1" },
            }),
            { next },
        )

        expect(next).toHaveBeenCalledTimes(1)
        await expect(response.text()).resolves.toBe("---\ntitle: Authored\n---")
    })

    it("returns 429 with Retry-After past the per-IP cap", async () => {
        const next = vi.fn<() => Promise<Response>>(async () => new Response("ok"))

        let response: Response | undefined
        for (let i = 0; i <= RATE_LIMIT_MAX_REQUESTS; i++) {
            response = await markdown(new Request("https://www.kevinkraemer.com/cv"), { next, ip: "10.8.8.8" })
        }

        expect(response?.status).toBe(429)
        expect(response?.headers.get("Content-Type")).toBe("application/problem+json")
        expect(Number(response?.headers.get("Retry-After"))).toBeGreaterThan(0)
        await expect(response?.json()).resolves.toMatchObject({ code: "RATE_LIMITED" })
    })
})
