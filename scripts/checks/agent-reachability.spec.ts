import { readFileSync } from "node:fs"

import { describe, expect, it } from "vite-plus/test"

import { allowsAgent, checkRobots, probeAgent } from "./agent-reachability.mjs"

const robots = readFileSync("public/robots.txt", "utf8")

describe("agent reachability check", () => {
    it("allows every retrieval agent in the shipped robots.txt", () => {
        for (const row of checkRobots(robots)) {
            expect(row.allowed).toBe(true)
        }
    })

    it("rejects a blocked agent", () => {
        expect(allowsAgent("User-agent: GPTBot\nDisallow: /\n", "GPTBot")).toBe(false)
    })

    it("rejects a missing agent", () => {
        expect(allowsAgent("User-agent: *\nAllow: /\n", "PerplexityBot")).toBe(false)
    })

    it("maps probe statuses to ok", async () => {
        const okFetch: typeof fetch = async () => new Response(null, { status: 200 })
        const blockedFetch: typeof fetch = async () => new Response(null, { status: 403 })
        const ok = await probeAgent("https://example.com/", "PerplexityBot", okFetch)
        expect(ok).toEqual({ agent: "PerplexityBot", status: 200, ok: true })
        const blocked = await probeAgent("https://example.com/", "PerplexityBot", blockedFetch)
        expect(blocked).toEqual({ agent: "PerplexityBot", status: 403, ok: false })
    })
})
