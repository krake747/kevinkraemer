import * as v from "valibot"

import { apiVersion } from "../../../src/core/site/api-version.ts"
import type {
    AgentView,
    AgentViewEndpoint,
    FileDescriptor,
    PageDescriptor,
} from "../../../src/core/site/descriptors.ts"

const TITLE_PATTERN = /<title[^>]*>([\s\S]*?)<\/title>/i
const META_TAG_PATTERN = /<meta\s[^>]*>/gi
const ATTRIBUTE_PATTERN = /(\w+)\s*=\s*("([^"]*)"|'([^']*)')/g

const ENTITIES: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&#x27;": "'",
}

function normalizeWhitespace(value: string): string {
    let unescaped = value
    for (const [entity, replacement] of Object.entries(ENTITIES)) {
        unescaped = unescaped.split(entity).join(replacement)
    }
    return unescaped.replace(/\s+/g, " ").trim()
}

function parseAttributes(tag: string): Record<string, string> {
    const attributes: Record<string, string> = {}
    for (const match of tag.matchAll(ATTRIBUTE_PATTERN)) {
        attributes[match[1]?.toLowerCase() ?? ""] = match[3] ?? match[4] ?? ""
    }
    return attributes
}

export function extractPageMeta(html: string): { title: string; description: string } {
    const title = TITLE_PATTERN.exec(html)?.[1] ?? ""
    const tags = html.match(META_TAG_PATTERN) ?? []
    let description = ""
    for (const tag of tags) {
        const attributes = parseAttributes(tag)
        if (attributes["name"]?.toLowerCase() === "description") {
            description = attributes["content"] ?? ""
        }
    }
    return {
        title: normalizeWhitespace(title),
        description: normalizeWhitespace(description),
    }
}

type FileDescriptorOptions = { url: string; contentType: string; content: string }

export function fileDescriptorResponse({ url, contentType, content }: FileDescriptorOptions): Response {
    const descriptor: FileDescriptor = {
        url,
        contentType,
        content,
        apiVersion,
    }
    return new Response(JSON.stringify(descriptor), {
        status: 200,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "API-Version": apiVersion,
            Vary: "Accept, Accept-Encoding",
        },
    })
}

const OpenapiOperationSchema = v.object({
    operationId: v.optional(v.string()),
    summary: v.optional(v.string()),
    description: v.optional(v.string()),
})

const OpenapiLikeSchema = v.object({
    info: v.optional(
        v.object({
            title: v.optional(v.string()),
            description: v.optional(v.string()),
            version: v.optional(v.string()),
        }),
    ),
    servers: v.optional(v.array(v.object({ url: v.optional(v.string()) }))),
    paths: v.optional(
        v.record(
            v.string(),
            v.object({
                get: v.optional(OpenapiOperationSchema),
                post: v.optional(OpenapiOperationSchema),
                query: v.optional(OpenapiOperationSchema),
            }),
        ),
    ),
    externalDocs: v.optional(v.object({ url: v.optional(v.string()) })),
})

type OpenapiLike = v.InferOutput<typeof OpenapiLikeSchema>

export function buildAgentView(origin: string, doc: unknown): AgentView {
    const result = v.safeParse(OpenapiLikeSchema, doc ?? {})
    const parsed: OpenapiLike = result.success ? result.output : {}
    const paths = parsed.paths ?? {}
    const endpoints: AgentViewEndpoint[] = Object.entries(paths).map(([path, item]) => {
        const operation = item.get ?? item.post ?? item.query
        return {
            path,
            url: `${origin}${path}`,
            operationId: operation?.operationId ?? "",
            summary: operation?.summary ?? "",
            description: operation?.description ?? "",
        }
    })
    return {
        site: `${origin}/`,
        title: parsed.info?.title ?? "kevinkraemer.com retrieval API",
        description: parsed.info?.description ?? "",
        apiVersion,
        authentication: {
            required: false,
            type: "none",
            details:
                "All endpoints are unauthenticated public GETs and POSTs. No API keys exist and none are required.",
        },
        rateLimits: {
            requestsPerMinute: 600,
            scope: "per address across pages, negotiated representations, and API paths",
            headers: ["RateLimit-Limit", "RateLimit-Remaining", "RateLimit-Reset"],
            onExceeded: "HTTP 429 with Retry-After plus an RFC 9457 problem envelope.",
        },
        capabilities: [
            {
                name: "content-negotiation",
                description:
                    "Every page serves HTML by default, GitHub-flavored markdown for Accept: text/markdown, and a typed JSON page descriptor for Accept: application/json.",
            },
            {
                name: "structured-errors",
                description:
                    "Unknown paths return real HTTP 404s; Accept: application/json yields an RFC 9457 problem envelope with stable code and resolution hint. Reserved /api/* and /v1/* namespaces always answer JSON-first.",
            },
            {
                name: "discovery-files",
                description:
                    "llms.txt, llms-full.txt, openapi.json, RSS, sitemap, and an RFC 9264 api-catalog describe the whole surface for agents.",
            },
        ],
        endpoints,
        specification: `${origin}/openapi.json`,
        documentation: parsed.externalDocs?.url ?? `${origin}/developers`,
    }
}

export function agentViewResponse(origin: string, doc: unknown): Response {
    return new Response(JSON.stringify(buildAgentView(origin, doc)), {
        status: 200,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "API-Version": apiVersion,
        },
    })
}

type PageDescriptorOptions = { url: string; html: string }

export function pageDescriptorResponse({ url, html }: PageDescriptorOptions): Response {
    const meta = extractPageMeta(html)
    const descriptor: PageDescriptor = {
        url,
        title: meta.title,
        description: meta.description,
        representations: ["text/html", "text/markdown", "application/json"],
        apiVersion,
    }
    return new Response(JSON.stringify(descriptor), {
        status: 200,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "API-Version": apiVersion,
            Vary: "Accept, Accept-Encoding",
        },
    })
}
