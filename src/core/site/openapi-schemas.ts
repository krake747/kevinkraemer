import type { AskAnswer } from "@core/ask/ask"
import { ASK_QUESTION_MAX_LENGTH, askRequestSchema } from "@core/ask/request"
import type { TapePrint } from "@core/ask/tape"
import type { AgentView, FileDescriptor, PageDescriptor } from "@core/site/descriptors"
import type { SchemaRefOrObject } from "@core/site/openapi-types"
import { PROBLEM_CODES, type ProblemDocument } from "@core/site/problem"
import { toJsonSchema } from "@valibot/to-json-schema"

const pageDescriptorFields: Record<keyof PageDescriptor, SchemaRefOrObject> = {
    url: {
        type: "string",
        format: "uri",
        description: "Canonical URL of the described page.",
    },
    title: { type: "string", description: "The page's document title." },
    description: { type: "string", description: "The page's meta description, empty when the page sets none." },
    representations: {
        type: "array",
        items: { type: "string", enum: ["text/html", "text/markdown", "application/json"] },
        description: "Media types this URL can serve, selected by the request's Accept header.",
    },
    apiVersion: {
        type: "string",
        description: "Version of this retrieval interface; see the versioning policy in info.description.",
    },
}

export const pageDescriptorSchema: SchemaRefOrObject = {
    type: "object",
    description:
        "Machine-readable summary of one page, returned when a request sends Accept: application/json. Title and description are extracted from the page's own head metadata.",
    properties: pageDescriptorFields,
    required: Object.keys(pageDescriptorFields),
    additionalProperties: false,
}

const fileDescriptorFields: Record<keyof FileDescriptor, SchemaRefOrObject> = {
    url: {
        type: "string",
        format: "uri",
        description: "Canonical URL of the wrapped file.",
    },
    contentType: {
        type: "string",
        description: "Native media type of the wrapped file, e.g. text/plain or application/rss+xml.",
    },
    content: { type: "string", description: "The file body verbatim." },
    apiVersion: {
        type: "string",
        description: "Version of this retrieval interface; see the versioning policy in info.description.",
    },
}

export const fileDescriptorSchema: SchemaRefOrObject = {
    type: "object",
    description:
        "A text-based discovery file (llms.txt, RSS, sitemap, robots.txt) wrapped as JSON, returned when the request sends Accept: application/json. content is the file verbatim.",
    properties: fileDescriptorFields,
    required: Object.keys(fileDescriptorFields),
    additionalProperties: false,
}

const agentViewFields: Record<keyof AgentView, SchemaRefOrObject> = {
    site: {
        type: "string",
        format: "uri",
        description: "Canonical site origin with trailing slash.",
    },
    title: { type: "string", description: "Title of the retrieval interface from the OpenAPI info object." },
    description: { type: "string", description: "Description of the retrieval interface." },
    apiVersion: {
        type: "string",
        description: "Version of this retrieval interface; see the versioning policy in info.description.",
    },
    authentication: {
        type: "object",
        description: "Authentication info: required is always false, type is none; details explains no API keys exist.",
    },
    rateLimits: {
        type: "object",
        description: "Rate limit policy: requests per minute, scope, header names, and 429 behavior.",
    },
    capabilities: {
        type: "array",
        items: {
            type: "object",
            description: "Named capability with a human-readable description.",
        },
        description: "Key capabilities: content negotiation, structured errors, and discovery files.",
    },
    endpoints: {
        type: "array",
        items: {
            type: "object",
            description: "One endpoint with path, absolute url, operationId, summary, and description.",
        },
        description: "Every path from the OpenAPI document, in document order.",
    },
    specification: {
        type: "string",
        format: "uri",
        description: "Absolute URL of this OpenAPI document.",
    },
    documentation: {
        type: "string",
        format: "uri",
        description: "Absolute URL of the developer documentation page.",
    },
}

export const agentViewSchema: SchemaRefOrObject = {
    type: "object",
    description:
        "Structured ?mode=agent inventory of the homepage: endpoint list with operation IDs, authentication info, rate limits, and key capabilities. Returned instead of the PageDescriptor when the homepage is requested with ?mode=agent.",
    properties: agentViewFields,
    required: Object.keys(agentViewFields),
    additionalProperties: false,
}

const problemFields: Record<keyof ProblemDocument, SchemaRefOrObject> = {
    type: {
        type: "string",
        format: "uri",
        description: "URI identifying the problem class (httpstatuses.com reference).",
    },
    title: { type: "string", description: "Short human-readable summary of the problem class." },
    status: { type: "integer", description: "The HTTP status code, repeated for convenience." },
    detail: { type: "string", description: "Plain-language explanation of this specific occurrence." },
    code: {
        type: "string",
        enum: [...PROBLEM_CODES],
        description: "Stable machine-readable error code.",
    },
    hint: {
        type: "string",
        description: "Resolution hint with a next step.",
    },
}

export const problemSchema: SchemaRefOrObject = {
    type: "object",
    description:
        "RFC 9457 problem-details envelope returned for every 4xx/5xx, served as application/problem+json. code and hint are site extensions with stable machine-readable values.",
    properties: problemFields,
    required: Object.keys(problemFields),
    additionalProperties: false,
}

const askRequestFields = toJsonSchema(askRequestSchema, { target: "openapi-3.0" })

const { properties: askRequestProperties = {} } = askRequestFields

const rawQuestionField = askRequestProperties["question"]

const askQuestionField: SchemaRefOrObject = {
    ...(typeof rawQuestionField === "boolean" || rawQuestionField === undefined ? {} : rawQuestionField),
    example: "What did Kevin build at Dennemeyer?",
}

export const askRequestDocumentSchema: SchemaRefOrObject = {
    ...askRequestFields,
    description: `Question to answer from the site's published content. Matches the ask tool input: a non-blank question of up to ${ASK_QUESTION_MAX_LENGTH} characters; omit summarize for pages plus a written answer.`,
    properties: { ...askRequestProperties, question: askQuestionField },
    additionalProperties: false,
}

const askSourceFields: Record<keyof Pick<TapePrint, "path" | "title" | "description">, SchemaRefOrObject> = {
    path: {
        type: "string",
        format: "uri-reference",
        description: "Site path of the cited page.",
        example: "/cv",
    },
    title: { type: "string", description: "Title of the cited page." },
    description: { type: "string", description: "Description of the cited page." },
}

export const askSourceSchema: SchemaRefOrObject = {
    type: "object",
    description: "One cited source: the tape print whose content supports the answer.",
    properties: askSourceFields,
    required: Object.keys(askSourceFields),
    additionalProperties: false,
}

const askResponseFields: Record<keyof AskAnswer, SchemaRefOrObject> = {
    sources: {
        type: "array",
        items: { $ref: "#/components/schemas/AskSource" },
        description: "Cited sources, best match first. Empty only when summarization is off and nothing matched.",
    },
    summary: {
        type: "string",
        description: "First-person prose answer written from the sources. Absent when summarize is false.",
    },
}

export const askResponseSchema: SchemaRefOrObject = {
    type: "object",
    description: "Matching tape prints and, unless summarize was false, a prose answer grounded in them.",
    properties: askResponseFields,
    required: ["sources"],
    additionalProperties: false,
}

type McpRequestSchema = {
    type: "object"
    description: string
    properties: {
        jsonrpc: { type: "string"; enum: string[]; description: string }
        id: { type: "string"; description: string }
        method: { type: "string"; description: string; example: string }
        params: { type: "object"; description: string }
    }
    required: string[]
    additionalProperties: boolean
}

export const mcpRequestSchema: McpRequestSchema = {
    type: "object",
    description:
        "A JSON-RPC 2.0 MCP message. Send string ids; methods: initialize, tools/list, tools/call, resources/list, resources/read.",
    properties: {
        jsonrpc: { type: "string", enum: ["2.0"], description: "JSON-RPC protocol version, always 2.0." },
        id: { type: "string", description: "Request id echoed back in the response." },
        method: {
            type: "string",
            description: "MCP method to invoke on this server.",
            example: "tools/call",
        },
        params: {
            type: "object",
            description: "Method parameters; tools/call takes {name: 'ask', arguments: AskRequest}.",
        },
    },
    required: ["jsonrpc", "method"],
    additionalProperties: true,
}

type McpResponseSchema = {
    type: "object"
    description: string
    properties: {
        jsonrpc: { type: "string"; enum: string[]; description: string }
        id: { type: "string"; description: string }
        result: { type: "object"; description: string }
        error: { type: "object"; description: string }
    }
    required: string[]
    additionalProperties: boolean
}

export const mcpResponseSchema: McpResponseSchema = {
    type: "object",
    description: "A JSON-RPC 2.0 response: result on success, error (with code and message) instead on failure.",
    properties: {
        jsonrpc: { type: "string", enum: ["2.0"], description: "JSON-RPC protocol version, always 2.0." },
        id: { type: "string", description: "Echo of the request id." },
        result: {
            type: "object",
            description: "Result payload: tool results, resource lists, or resource contents.",
        },
        error: {
            type: "object",
            description: "Protocol error with code and message; present instead of result on failure.",
        },
    },
    required: ["jsonrpc", "id"],
    additionalProperties: true,
}
