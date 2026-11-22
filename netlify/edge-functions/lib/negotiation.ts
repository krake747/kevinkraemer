import { problemResponse } from "../../../src/core/site/problem.ts"

const NEGOTIABLE_EXTENSIONS = new Set(["html", "md"])
const NON_NEGOTIABLE_PREFIXES = ["/.well-known/", "/assets/", "/pagefind/", "/mcp/"]

const BYPASS_PATHS = new Set(["/ask", "/mcp"])

const PUBLISHED_MEDIA_TYPES = new Map([["/mcp/server-card", "application/mcp-server-card+json"]])

export function publishedMediaType(pathname: string): string | undefined {
    return PUBLISHED_MEDIA_TYPES.get(pathname.toLowerCase().replace(/\/+$/, ""))
}

export function isBypassPath(pathname: string): boolean {
    const normalized = pathname.toLowerCase().replace(/\/+$/, "") || "/"
    return BYPASS_PATHS.has(normalized)
}

export function isApiPath(pathname: string): boolean {
    const normalized = pathname.toLowerCase().replace(/\/+$/, "") || "/"
    if (normalized === "/api" || normalized === "/v1") {
        return true
    }
    return normalized.startsWith("/api/") || normalized.startsWith("/v1/")
}

export function isAgentMode(pathname: string, search: string): boolean {
    const normalized = pathname.toLowerCase().replace(/\/+$/, "") || "/"
    if (normalized !== "/" && normalized !== "/index.html") {
        return false
    }
    return new URLSearchParams(search).get("mode") === "agent"
}

const JSON_WRAPPABLE_EXTENSIONS = new Set(["txt", "xml"])

function extensionOf(pathname: string): string | null {
    const lastSegment = pathname.toLowerCase().replace(/\/+$/, "").split("/").pop() ?? ""
    if (!lastSegment.includes(".")) {
        return null
    }
    return lastSegment.slice(lastSegment.lastIndexOf(".") + 1)
}

export function isJsonWrappableFile(pathname: string): boolean {
    if (isNegotiablePage(pathname) || isApiPath(pathname)) {
        return false
    }
    const extension = extensionOf(pathname)
    if (extension === null) {
        return false
    }
    return JSON_WRAPPABLE_EXTENSIONS.has(extension)
}

export function wantsMarkdown(accept: string): boolean {
    return accept.includes("text/markdown")
}

export function wantsMarkdownExtension(pathname: string): boolean {
    return extensionOf(pathname) === "md"
}

export function wantsJSON(accept: string): boolean {
    return accept.includes("application/json") || accept.includes("application/problem+json")
}

export function isMeteredPath(pathname: string, search: string, accept: string): boolean {
    if (isAgentMode(pathname, search) || isApiPath(pathname) || isNegotiablePage(pathname)) {
        return true
    }
    return wantsJSON(accept) && isJsonWrappableFile(pathname)
}

export function isNegotiablePage(pathname: string): boolean {
    const path = pathname.toLowerCase()
    for (const prefix of NON_NEGOTIABLE_PREFIXES) {
        if (path.startsWith(prefix)) {
            return false
        }
    }
    const extension = extensionOf(path)
    if (extension === null) {
        return true
    }
    return NEGOTIABLE_EXTENSIONS.has(extension)
}

export function originHtmlPath(pathname: string): string {
    const path = pathname.toLowerCase().endsWith(".md") ? pathname.slice(0, -3) : pathname
    const trimmed = path.replace(/\/+$/, "")
    if (trimmed === "") {
        return "/index.html"
    }
    if (trimmed.endsWith(".html")) {
        return trimmed
    }
    return `${trimmed}.html`
}

export function withVary(response: Response, ...tokens: string[]): Response {
    const headers = new Headers(response.headers)
    const existing = headers.get("Vary") ?? ""
    const fields = existing
        .split(",")
        .map((field) => field.trim())
        .filter((field) => field.length > 0)
    for (const token of tokens) {
        const duplicate = fields.some((field) => field.toLowerCase() === token.toLowerCase())
        if (!duplicate) {
            fields.push(token)
        }
    }
    headers.set("Vary", fields.join(", "))
    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
    })
}

export function withNegotiatedVary(response: Response): Response {
    return withVary(response, "Accept", "Accept-Encoding")
}

export function pageNotFoundResponse(pathname: string): Response {
    return problemResponse({
        status: 404,
        code: "NOT_FOUND",
        detail: `No page exists at ${pathname}.`,
        hint: "Check the URL against /sitemap-index.xml or read /llms.txt for available resources.",
    })
}

export function upstreamUnavailableResponse(): Response {
    return problemResponse({
        status: 502,
        code: "UPSTREAM_ERROR",
        detail: "The requested resource could not be checked.",
        hint: "Retry the request, or use /llms.txt and /sitemap-index.xml to discover available resources.",
    })
}

export function agentUnavailableResponse(): Response {
    return problemResponse({
        status: 502,
        code: "UPSTREAM_ERROR",
        detail: "The agent inventory could not be built.",
        hint: "Retry the request, or fetch /openapi.json directly for the endpoint list.",
    })
}

export function apiNotFoundResponse(pathname: string): Response {
    return problemResponse({
        status: 404,
        code: "NOT_FOUND",
        detail: `No API resource exists at ${pathname}.`,
        hint: "Read /openapi.json for the full endpoint list or /llms.txt for retrieval guidance.",
    })
}

export function markdownNotFoundBody(origin: string): string {
    return [
        "# Not Found",
        "",
        `No page exists at this URL on ${origin}.`,
        "",
        "Machine-readable entry points:",
        "",
        `- [llms.txt](${origin}/llms.txt): site index written for agents`,
        `- [Sitemap](${origin}/sitemap-index.xml): every indexed page`,
        `- [Logs](${origin}/logs): writing archive`,
        `- [Developer docs](${origin}/developers): endpoints and retrieval quickstart`,
        "",
        "This resource returned HTTP 404.",
    ].join("\n")
}
