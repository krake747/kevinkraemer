import { apiVersion } from "../../src/core/site/api-version.ts"
import { agentViewResponse, fileDescriptorResponse, pageDescriptorResponse } from "./lib/descriptor.ts"
import { htmlToMarkdown } from "./lib/markdown.ts"
import {
    agentUnavailableResponse,
    apiNotFoundResponse,
    isAgentMode,
    isApiPath,
    isBypassPath,
    isJsonWrappableFile,
    isMeteredPath,
    isNegotiablePage,
    markdownNotFoundBody,
    originHtmlPath,
    pageNotFoundResponse,
    publishedMediaType,
    upstreamUnavailableResponse,
    wantsJSON,
    wantsMarkdown,
    wantsMarkdownExtension,
    withNegotiatedVary,
    withVary,
} from "./lib/negotiation.ts"
import { checkRateLimit, rateLimitedResponse, rateLimitHeaders } from "./lib/rate-limit.ts"

type EdgeContext = {
    next: () => Promise<Response>
    ip?: string
}

const sourceHeader = "x-markdown-source"

function isSourceRequest(request: Request): boolean {
    const pathname = new URL(request.url).pathname.toLowerCase()
    return request.headers.get(sourceHeader) === "1" && pathname.endsWith(".md")
}

function clientIp(request: Request, context: EdgeContext): string | null {
    if (context.ip && context.ip.length > 0) {
        return context.ip
    }
    const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    return forwarded && forwarded.length > 0 ? forwarded : null
}

function withHeaders(response: Response, headers: Record<string, string>): Response {
    const merged = new Headers(response.headers)
    for (const [name, value] of Object.entries(headers)) {
        merged.set(name, value)
    }
    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: merged,
    })
}

export default async (request: Request, context: EdgeContext): Promise<Response> => {
    if (isSourceRequest(request)) {
        return context.next()
    }
    const url = new URL(request.url)
    if (!isMeteredPath(url.pathname, url.search, request.headers.get("accept") ?? "")) {
        return negotiate(request, context)
    }
    const ip = clientIp(request, context)
    const decision = ip === null ? null : checkRateLimit(ip)
    if (decision?.limited) {
        return withVary(
            withHeaders(rateLimitedResponse(decision.retryAfter), rateLimitHeaders(decision)),
            "Accept",
            "Accept-Encoding",
        )
    }

    const response = await negotiate(request, context)
    if (decision === null) {
        return response
    }
    return withHeaders(response, rateLimitHeaders(decision))
}

type NegotiateInput = {
    request: Request
    context: EdgeContext
    url: URL
    accept: string
    wantsMd: boolean
}

type NegotiateHandler = (input: NegotiateInput) => Promise<Response | null>

function toNegotiateInput(request: Request, context: EdgeContext): NegotiateInput {
    const url = new URL(request.url)
    const accept = request.headers.get("accept") ?? ""
    return {
        request,
        context,
        url,
        accept,
        wantsMd: wantsMarkdown(accept) || wantsMarkdownExtension(url.pathname),
    }
}

function bypassHandler(input: NegotiateInput): Promise<Response | null> {
    return isBypassPath(input.url.pathname) ? Promise.resolve(input.context.next()) : Promise.resolve(null)
}

function agentHandler(input: NegotiateInput): Promise<Response | null> {
    return isAgentMode(input.url.pathname, input.url.search) ? serveAgentView(input.url) : Promise.resolve(null)
}

function apiHandler(input: NegotiateInput): Promise<Response | null> {
    return isApiPath(input.url.pathname)
        ? Promise.resolve(withNegotiatedVary(apiNotFoundResponse(input.url.pathname)))
        : Promise.resolve(null)
}

async function publishedHandler(input: NegotiateInput): Promise<Response | null> {
    const mediaType = publishedMediaType(input.url.pathname)
    if (mediaType === undefined) {
        return null
    }
    const response = await input.context.next()
    return response.ok ? withHeaders(response, { "Content-Type": mediaType }) : response
}

function jsonPageHandler(input: NegotiateInput): Promise<Response | null> {
    return wantsJSON(input.accept) && isNegotiablePage(input.url.pathname)
        ? serveJsonPage(input.request, input.url)
        : Promise.resolve(null)
}

function jsonFileHandler(input: NegotiateInput): Promise<Response | null> {
    return wantsJSON(input.accept) && isJsonWrappableFile(input.url.pathname)
        ? serveJsonFile(input.request, input.url)
        : Promise.resolve(null)
}

function passthroughHandler(input: NegotiateInput): Promise<Response | null> {
    return input.wantsMd ? Promise.resolve(null) : servePassthrough(input.context, input.url)
}

function markdownHandler(input: NegotiateInput): Promise<Response | null> {
    return isNegotiablePage(input.url.pathname) ? serveMarkdown(input.url) : Promise.resolve(input.context.next())
}

const negotiateHandlers: NegotiateHandler[] = [
    bypassHandler,
    agentHandler,
    apiHandler,
    publishedHandler,
    jsonPageHandler,
    jsonFileHandler,
    passthroughHandler,
    markdownHandler,
]

async function negotiate(request: Request, context: EdgeContext): Promise<Response> {
    const input = toNegotiateInput(request, context)
    for (const handle of negotiateHandlers) {
        const response = await handle(input)
        if (response !== null) {
            return response
        }
    }
    return context.next()
}

async function serveAgentView(url: URL): Promise<Response> {
    try {
        const res = await fetch(new URL("/openapi.json", url.origin))
        if (!res.ok) {
            return agentUnavailableResponse()
        }
        return agentViewResponse(url.origin, await res.json())
    } catch {
        return agentUnavailableResponse()
    }
}

async function serveJsonPage(request: Request, url: URL): Promise<Response> {
    try {
        const res = await fetch(new URL(originHtmlPath(url.pathname), url.origin))
        if (!res.ok) {
            return withNegotiatedVary(pageNotFoundResponse(url.pathname))
        }
        return withNegotiatedVary(pageDescriptorResponse({ url: request.url, html: await res.text() }))
    } catch {
        return withNegotiatedVary(upstreamUnavailableResponse())
    }
}

async function serveJsonFile(request: Request, url: URL): Promise<Response> {
    try {
        const res = await fetch(new URL(url.pathname, url.origin))
        if (!res.ok) {
            return withNegotiatedVary(pageNotFoundResponse(url.pathname))
        }
        const contentType = res.headers.get("content-type")?.split(";")[0]?.trim() || "text/plain"
        return withNegotiatedVary(fileDescriptorResponse({ url: request.url, contentType, content: await res.text() }))
    } catch {
        return withNegotiatedVary(upstreamUnavailableResponse())
    }
}

async function servePassthrough(context: EdgeContext, url: URL): Promise<Response> {
    const response = await context.next()
    if (isNegotiablePage(url.pathname)) {
        return withVary(response, "Accept")
    }
    return response
}

async function serveMarkdown(url: URL): Promise<Response> {
    const authored = await readAuthoredMarkdown(url)
    if (authored !== null) {
        return markdownResponse(authored)
    }

    const res = await fetch(new URL(originHtmlPath(url.pathname), url.origin))

    if (!res.ok) {
        return new Response(markdownNotFoundBody(url.origin), {
            status: 404,
            headers: {
                "Content-Type": "text/markdown; charset=utf-8",
                Vary: "Accept, Accept-Encoding",
                "API-Version": apiVersion,
            },
        })
    }

    return markdownResponse(htmlToMarkdown(await res.text()))
}

async function readAuthoredMarkdown(url: URL): Promise<string | null> {
    try {
        const response = await fetch(new URL(url.pathname, url.origin), {
            headers: { [sourceHeader]: "1" },
        })
        if (!response.ok) {
            return null
        }
        const contentType = response.headers.get("content-type") ?? ""
        return contentType.includes("text/html") ? null : await response.text()
    } catch {
        return null
    }
}

function markdownResponse(markdown: string): Response {
    const tokens = markdown.split(/\s+/).length
    return new Response(markdown, {
        status: 200,
        headers: {
            "Content-Type": "text/markdown; charset=utf-8",
            Vary: "Accept, Accept-Encoding",
            "API-Version": apiVersion,
            "x-markdown-tokens": String(tokens),
        },
    })
}

export const config = {
    path: "/*",
}
