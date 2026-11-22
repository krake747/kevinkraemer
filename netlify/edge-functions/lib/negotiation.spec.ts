import { describe, expect, it } from "vite-plus/test"

import { apiVersion } from "../../../src/core/site/api-version.ts"
import {
    apiNotFoundResponse,
    isAgentMode,
    isApiPath,
    isBypassPath,
    isJsonWrappableFile,
    isMeteredPath,
    isNegotiablePage,
    markdownNotFoundBody,
    originHtmlPath,
    publishedMediaType,
    wantsJSON,
    wantsMarkdown,
    wantsMarkdownExtension,
    withVary,
} from "./negotiation.ts"

describe("metering", () => {
    it.each([
        ["/", "", "text/html", true],
        ["/logs/some-post", "", "text/html", true],
        ["/logs/some-post.md", "", "text/markdown", true],
        ["/api/anything", "", "text/html", true],
        ["/", "?mode=agent", "application/json", true],
        ["/llms.txt", "", "application/json", true],
        ["/llms.txt", "", "text/html", false],
        ["/assets/index-abc123.js", "", "*/*", false],
        ["/pagefind/pagefind.js", "", "*/*", false],
        ["/fonts/geist-variable.woff2", "", "*/*", false],
        ["/favicon.svg", "", "image/svg+xml", false],
        ["/openapi.json", "", "*/*", false],
        ["/.well-known/ard.json", "", "application/json", false],
        ["/mcp/server-card", "", "application/mcp-server-card+json", false],
    ] as const)("isMeteredPath(%s, %s, %s) -> %s", (pathname, search, accept, expected) => {
        expect(isMeteredPath(pathname, search, accept)).toBe(expected)
    })
})

describe("markdown negotiation", () => {
    it.each([
        ["text/markdown", true],
        ["text/html,application/xhtml+xml,text/markdown;q=0.9,*/*;q=0.8", true],
        ["text/html", false],
        ["*/*", false],
        ["", false],
    ])("accept %s -> %s", (accept, expected) => {
        expect(wantsMarkdown(accept)).toBe(expected)
    })
})

describe("markdown file extensions", () => {
    it.each([
        ["/logs/some-post.md", true],
        ["/logs/some-post.MD", true],
        ["/logs/some-post.md/", true],
        ["/LOGS/SOME-POST.MD", true],
        ["/a.b.md", true],
        ["/logs/some-post", false],
        ["/llms-full.txt", false],
        ["/", false],
        ["/file", false],
        ["/.md", true],
        ["", false],
    ])("%s -> %s", (pathname, expected) => {
        expect(wantsMarkdownExtension(pathname)).toBe(expected)
    })
})

describe("JSON negotiation", () => {
    it.each([
        ["application/json", true],
        ["application/problem+json", true],
        ["application/json, text/html;q=0.8", true],
        ["text/html", false],
        ["*/*", false],
        ["", false],
    ])("accept %s -> %s", (accept, expected) => {
        expect(wantsJSON(accept)).toBe(expected)
    })
})

describe("negotiable pages", () => {
    it.each([
        ["/", true],
        ["/logs", true],
        ["/cv", true],
        ["/developers", true],
        ["/index.html", true],
        ["/logs/some-post", true],
        ["/logs/some-post.md", true],
        ["/__ora-404-probe-yxsuhox9", true],
        ["/some-path-that-does-not-exist", true],
        ["/llms.txt", false],
        ["/llms-full.txt", false],
        ["/robots.txt", false],
        ["/rss.xml", false],
        ["/sitemap-index.xml", false],
        ["/20260503_kevinkraemer_cv.pdf", false],
        ["/social-preview.png", false],
        ["/favicon.svg", false],
        ["/assets/chunk.css", false],
        ["/pagefind/pagefind.js", false],
        ["/.well-known/api-catalog", false],
        ["/.well-known/ard.json", false],
        ["/mcp/server-card", false],
    ])("%s -> %s", (pathname, expected) => {
        expect(isNegotiablePage(pathname)).toBe(expected)
    })
})

describe("reserved API paths", () => {
    it.each([
        ["/api", true],
        ["/api/", true],
        ["/api/pages", true],
        ["/v1", true],
        ["/v1/", true],
        ["/v1/openapi.json", true],
        ["/API/pages", true],
        ["/", false],
        ["/cv", false],
        ["/openapi.json", false],
        ["/llms.txt", false],
        ["/apples/", false],
        ["/v10/", false],
    ])("%s -> %s", (pathname, expected) => {
        expect(isApiPath(pathname)).toBe(expected)
    })
})

describe("bypass paths", () => {
    it.each([
        ["/ask", true],
        ["/ask/", true],
        ["/ASK", true],
        ["/mcp", true],
        ["/mcp/", true],
        ["/MCP", true],
        ["/", false],
        ["/cv", false],
        ["/askfoo", false],
        ["/api", false],
        ["/openapi.json", false],
    ])("%s -> %s", (pathname, expected) => {
        expect(isBypassPath(pathname)).toBe(expected)
    })
})

describe("the published media type", () => {
    it.each([
        ["/mcp/server-card", "application/mcp-server-card+json"],
        ["/mcp/server-card/", "application/mcp-server-card+json"],
        ["/mcp", undefined],
        ["/llms.txt", undefined],
    ])("%s -> %s", (pathname, expected) => {
        expect(publishedMediaType(pathname)).toBe(expected)
    })
})

describe("JSON-wrappable files", () => {
    it.each([
        ["/llms.txt", true],
        ["/llms-full.txt", true],
        ["/robots.txt", true],
        ["/rss.xml", true],
        ["/sitemap-index.xml", true],
        ["/LLMS.TXT", true],
        ["/", false],
        ["/cv", false],
        ["/logs/some-post", false],
        ["/openapi.json", false],
        ["/.well-known/api-catalog", false],
        ["/20260503_kevinkraemer_cv.pdf", false],
        ["/favicon.svg", false],
        ["/api/pages", false],
        ["/v1/openapi.json", false],
    ])("%s -> %s", (pathname, expected) => {
        expect(isJsonWrappableFile(pathname)).toBe(expected)
    })
})

describe("API not-found responses", () => {
    it("returns a JSON-first 404 agents can parse without an Accept header", async () => {
        const response = apiNotFoundResponse("/v1/pages")
        expect(response.status).toBe(404)
        expect(response.headers.get("Content-Type")).toBe("application/problem+json")
        expect(response.headers.get("API-Version")).toBe(apiVersion)
        const body = await response.json()
        expect(body.code).toBe("NOT_FOUND")
        expect(body.detail).toContain("/v1/pages")
    })
})

describe("agent mode", () => {
    it.each([
        ["/", "?mode=agent", true],
        ["/", "?foo=1&mode=agent", true],
        ["/index.html", "?mode=agent", true],
        ["/", "", false],
        ["/", "?mode=html", false],
        ["/", "?mode=Agent", false],
        ["/cv", "?mode=agent", false],
        ["/openapi.json", "?mode=agent", false],
    ])("%s %s -> %s", (pathname, search, expected) => {
        expect(isAgentMode(pathname, search)).toBe(expected)
    })
})

describe("the HTML path for an origin URL", () => {
    it.each([
        ["/", "/index.html"],
        ["/cv", "/cv.html"],
        ["/logs", "/logs.html"],
        ["/logs/some-post", "/logs/some-post.html"],
        ["/logs/some-post.md", "/logs/some-post.html"],
        ["/cv.md", "/cv.html"],
        ["/index.html", "/index.html"],
        ["/logs/some-post.MD", "/logs/some-post.html"],
        ["", "/index.html"],
        ["/a/", "/a.html"],
        ["///", "/index.html"],
    ])("%s -> %s", (pathname, expected) => {
        expect(originHtmlPath(pathname)).toBe(expected)
    })
})

function varyOf(vary: string | undefined): string | undefined {
    const response = withVary(
        new Response("body", { status: 200, headers: vary === undefined ? {} : { Vary: vary } }),
        "Accept",
    )
    return response.headers.get("Vary") ?? undefined
}

describe("Vary header handling", () => {
    it("adds Accept when Vary is missing", () => {
        expect(varyOf(undefined)).toBe("Accept")
    })

    it("merges with existing Accept-Encoding", () => {
        expect(varyOf("Accept-Encoding")).toBe("Accept-Encoding, Accept")
    })

    it("does not duplicate case-insensitive matches", () => {
        expect(varyOf("accept-encoding, accept")).toBe("accept-encoding, accept")
    })

    it("preserves status and body", () => {
        const response = withVary(new Response("payload", { status: 404 }), "Accept")
        expect(response.status).toBe(404)
        return expect(response.text()).resolves.toBe("payload")
    })
})

describe("markdown not-found bodies", () => {
    const body = markdownNotFoundBody("https://www.kevinkraemer.com")

    it("points agents at machine-readable entry points", () => {
        expect(body).toContain("/llms.txt")
        expect(body).toContain("/sitemap-index.xml")
        expect(body).toContain("/logs")
        expect(body).toContain("/developers")
        expect(body).toContain("# Not Found")
    })
})
