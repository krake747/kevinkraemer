import { describe, expect, it } from "vite-plus/test"

import { apiVersion } from "../../../src/core/site/api-version.ts"
import {
    agentViewResponse,
    buildAgentView,
    extractPageMeta,
    fileDescriptorResponse,
    pageDescriptorResponse,
} from "./descriptor.ts"

describe("page metadata", () => {
    it("reads the title and the description meta tag", () => {
        const meta = extractPageMeta(`
            <head>
                <title>Curriculum vitae</title>
                <meta name="description" content="Verified career facts." />
            </head>
        `)
        expect(meta).toEqual({ title: "Curriculum vitae", description: "Verified career facts." })
    })

    it("reads content-first meta attribute order", () => {
        const meta = extractPageMeta(`<meta content="About Kevin." name="description" />`)
        expect(meta.description).toBe("About Kevin.")
    })

    it("unescapes entities and collapses whitespace", () => {
        const meta = extractPageMeta(`
            <title>Kevin Kraemer &amp;  Logs</title>
            <meta name="description" content="Thoughts  on  code." />
        `)
        expect(meta.title).toBe("Kevin Kraemer & Logs")
        expect(meta.description).toBe("Thoughts on code.")
    })

    it("falls back to empty strings when tags are missing", () => {
        expect(extractPageMeta("<p>No head here</p>")).toEqual({ title: "", description: "" })
    })
})

describe("the agent view", () => {
    const doc = {
        info: { title: "Retrieval API", description: "Docs.", version: "1.0.0" },
        paths: {
            "/": { get: { operationId: "getHomePage", summary: "Home", description: "Landing." } },
            "/cv": { get: { operationId: "getCvPage", summary: "CV", description: "Career facts." } },
        },
        externalDocs: { url: "https://www.kevinkraemer.com/developers" },
    }

    it("lists endpoints with auth info and capabilities", () => {
        const view = buildAgentView("https://www.kevinkraemer.com", doc)
        expect(view.site).toBe("https://www.kevinkraemer.com/")
        expect(view.apiVersion).toBe(apiVersion)
        expect(view.authentication).toEqual({
            required: false,
            type: "none",
            details: expect.stringContaining("No API keys"),
        })
        expect(view.rateLimits.requestsPerMinute).toBe(600)
        expect(view.capabilities.length).toBeGreaterThan(0)
        expect(view.endpoints).toEqual([
            {
                path: "/",
                url: "https://www.kevinkraemer.com/",
                operationId: "getHomePage",
                summary: "Home",
                description: "Landing.",
            },
            {
                path: "/cv",
                url: "https://www.kevinkraemer.com/cv",
                operationId: "getCvPage",
                summary: "CV",
                description: "Career facts.",
            },
        ])
        expect(view.specification).toBe("https://www.kevinkraemer.com/openapi.json")
        expect(view.documentation).toBe("https://www.kevinkraemer.com/developers")
    })

    it("falls back to empty lists for unknown shapes", () => {
        const view = buildAgentView("https://www.kevinkraemer.com", null)
        expect(view.endpoints).toEqual([])
        expect(view.apiVersion).toBe(apiVersion)
    })

    it("ignores non-object paths instead of indexing into them", () => {
        const view = buildAgentView("https://www.kevinkraemer.com", { paths: "ab" })
        expect(view.endpoints).toEqual([])
    })

    it("prefers GET over POST and falls back to POST-only operations", () => {
        const view = buildAgentView("https://www.kevinkraemer.com", {
            info: {},
            paths: {
                "/ask": {
                    get: { operationId: "getAskAnswer", summary: "Ask", description: "Asking." },
                    post: { operationId: "postAskAnswer", summary: "Ask (POST)", description: "Asking by post." },
                },
                "/mcp": {
                    post: { operationId: "postMcpMessage", summary: "MCP", description: "MCP endpoint." },
                },
            },
        })
        expect(view.endpoints).toEqual([
            {
                path: "/ask",
                url: "https://www.kevinkraemer.com/ask",
                operationId: "getAskAnswer",
                summary: "Ask",
                description: "Asking.",
            },
            {
                path: "/mcp",
                url: "https://www.kevinkraemer.com/mcp",
                operationId: "postMcpMessage",
                summary: "MCP",
                description: "MCP endpoint.",
            },
        ])
    })
})

describe("the agent view response", () => {
    it("serves the inventory as versioned JSON", async () => {
        const response = agentViewResponse("https://www.kevinkraemer.com", { info: {}, paths: {} })
        expect(response.status).toBe(200)
        expect(response.headers.get("Content-Type")).toBe("application/json; charset=utf-8")
        expect(response.headers.get("API-Version")).toBe(apiVersion)
        const body = await response.json()
        expect(body.site).toBe("https://www.kevinkraemer.com/")
        expect(body.authentication.required).toBe(false)
    })
})

describe("file descriptors", () => {
    it("wraps a discovery file in a typed JSON envelope", async () => {
        const response = fileDescriptorResponse({
            url: "https://www.kevinkraemer.com/llms.txt",
            contentType: "text/plain",
            content: "# Kevin Kraemer",
        })
        expect(response.status).toBe(200)
        expect(response.headers.get("Content-Type")).toBe("application/json; charset=utf-8")
        expect(response.headers.get("API-Version")).toBe(apiVersion)
        expect(response.headers.get("Vary")).toBe("Accept, Accept-Encoding")
        expect(await response.json()).toEqual({
            url: "https://www.kevinkraemer.com/llms.txt",
            contentType: "text/plain",
            content: "# Kevin Kraemer",
            apiVersion,
        })
    })
})

describe("page descriptors", () => {
    it("returns a typed JSON descriptor with Vary: Accept", async () => {
        const response = pageDescriptorResponse({
            url: "https://www.kevinkraemer.com/cv",
            html: `<head><title>CV</title><meta name="description" content="Career facts." /></head>`,
        })
        expect(response.status).toBe(200)
        expect(response.headers.get("Content-Type")).toBe("application/json; charset=utf-8")
        expect(response.headers.get("API-Version")).toBe(apiVersion)
        expect(response.headers.get("Vary")).toBe("Accept, Accept-Encoding")
        expect(await response.json()).toEqual({
            url: "https://www.kevinkraemer.com/cv",
            title: "CV",
            description: "Career facts.",
            representations: ["text/html", "text/markdown", "application/json"],
            apiVersion,
        })
    })
})
