import { ASK_QUESTION_MAX_LENGTH } from "@core/ask/request"
import { apiVersion } from "@core/site/api-version"
import type {
    HeaderParameterObject,
    ParameterReference,
    ResponseHeader,
    ResponseObject,
    SchemaRefOrObject,
} from "@core/site/openapi-types"
import { DEPRECATION_SUNSET_DAYS } from "@core/site/policy"
import type { ProblemCode } from "@core/site/problem"

export const varyHeader = {
    description:
        "Representation negotiated by the request's Accept header. Always 'Accept, Accept-Encoding' so caches store HTML and markdown separately.",
    schema: { type: "string" },
} satisfies ResponseHeader

export const apiVersionHeader = {
    description:
        "Version of this retrieval interface. Sent on every machine-readable response; see the versioning policy in info.description.",
    schema: { type: "string" },
} satisfies ResponseHeader

export const apiVersionHeaderParameter: HeaderParameterObject = {
    name: "API-Version",
    in: "header",
    required: false,
    description: `Retrieval interface version the client built against (currently ${apiVersion}). Optional on requests; always echoed on machine-readable responses so agents detect interface drift.`,
    schema: { type: "string", enum: [apiVersion] },
    example: apiVersion,
}

export const apiVersionParameterRef: ParameterReference = { $ref: "#/components/parameters/ApiVersionHeader" }

export const deprecationHeaders: Record<string, ResponseHeader> = {
    Deprecation: {
        description:
            "Only present on deprecated endpoints, with value 'true'. See the deprecation policy in info.description.",
        schema: { type: "string" },
    },
    Sunset: {
        description: `Only present on deprecated endpoints: the RFC 7231 date after which the endpoint may be removed (at least ${DEPRECATION_SUNSET_DAYS} days after deprecation is announced).`,
        schema: { type: "string", format: "date" },
    },
}

type EncodedProblemInput = {
    status: number
    title: string
    code: ProblemCode
    description: string
    hint: string
    slug: string
}

function encodedProblem(input: EncodedProblemInput): SchemaRefOrObject {
    return {
        type: "object",
        description: input.description,
        properties: {
            type: {
                type: "string",
                format: "uri",
                description: `Problem type URI for ${input.slug}.`,
            },
            title: {
                type: "string",
                enum: [input.title],
                description: `Always "${input.title}".`,
            },
            status: {
                type: "integer",
                description: `Always ${input.status}.`,
            },
            code: {
                type: "string",
                enum: [input.code],
                description: `Always ${input.code}.`,
            },
            detail: {
                type: "string",
                description: "What went wrong in this specific occurrence.",
            },
            hint: {
                type: "string",
                description: input.hint,
            },
        },
        required: ["type", "title", "status", "code", "detail", "hint"],
        additionalProperties: false,
    }
}

export const notFoundProblemSchema = encodedProblem({
    status: 404,
    title: "Not Found",
    code: "NOT_FOUND",
    slug: "an unknown path",
    description: "No resource exists at this path. Same shape as Problem, with status and code pinned.",
    hint: "Discovery drive: read /llms.txt or /sitemap-index.xml for valid paths.",
})

export const rateLimitedProblemSchema = encodedProblem({
    status: 429,
    title: "Too Many Requests",
    code: "RATE_LIMITED",
    slug: "rate limiting",
    description: "The rate limit for one address was exceeded.",
    hint: "Wait for the Retry-After header, then retry.",
})

export const upstreamProblemSchema = encodedProblem({
    status: 502,
    title: "Bad Gateway",
    code: "UPSTREAM_ERROR",
    slug: "representation negotiation",
    description: "The origin failed while negotiating this representation.",
    hint: "Retry once; if it persists, read /llms.txt or /openapi.json directly.",
})

export const unavailableProblemSchema = encodedProblem({
    status: 503,
    title: "Service Unavailable",
    code: "ASK_UNAVAILABLE",
    slug: "ask configuration",
    description: "The ask endpoint is not configured on this deploy.",
    hint: "Use the retrieval endpoints; /llms-full.txt needs no configuration.",
})

export const methodNotAllowedProblemSchema = encodedProblem({
    status: 405,
    title: "Method Not Allowed",
    code: "METHOD_NOT_ALLOWED",
    slug: "an unsupported method",
    description: "The request used a method this resource does not implement.",
    hint: "Read the Allow header and retry with one of the listed methods.",
})

export const invalidRequestProblemSchema = encodedProblem({
    status: 400,
    title: "Bad Request",
    code: "INVALID_QUESTION",
    slug: "request validation",
    description: `The question failed validation: missing, blank, or over ${ASK_QUESTION_MAX_LENGTH} characters.`,
    hint: `Send a question up to ${ASK_QUESTION_MAX_LENGTH} characters, as ?question= or {"question"}.`,
})

export function problemContent(schemaName: string) {
    return {
        "application/problem+json": { schema: { $ref: `#/components/schemas/${schemaName}` } },
        "application/json": { schema: { $ref: `#/components/schemas/${schemaName}` } },
    }
}

function notFoundResponseFor(markdownDescription: string): ResponseObject {
    return {
        summary: "Not found",
        description:
            "No resource exists at this path. The problem envelope carries `code` and a `hint` pointing at the discovery files.",
        content: {
            ...problemContent("NotFoundProblem"),
            "text/markdown": {
                schema: {
                    type: "string",
                    description: markdownDescription,
                },
            },
        },
    }
}

export function notFoundInline(markdownDescription: string): Record<string, ResponseObject> {
    return { "404": notFoundResponseFor(markdownDescription) }
}

function rateLimitedResponseFor(): ResponseObject {
    return {
        summary: "Rate limited",
        description: "Rate limit exceeded. See `RateLimit-*` and `Retry-After`.",
        headers: {
            "Retry-After": {
                description: "Seconds to wait before retrying.",
                schema: { type: "string" },
            },
        },
        content: { ...problemContent("RateLimitedProblem") },
    }
}

export function rateLimitedInline(): Record<string, ResponseObject> {
    return { "429": rateLimitedResponseFor() }
}

export const notFoundResponse: ResponseObject = notFoundResponseFor(
    "Markdown notice titled '# Not Found' linking llms.txt, the sitemap, logs, and developer docs.",
)

export const rateLimitedResponse: ResponseObject = rateLimitedResponseFor()

export const upstreamErrorResponse: ResponseObject = {
    summary: "Origin failed",
    description: "Origin check failed while negotiating the representation (`UPSTREAM_ERROR`).",
    content: { ...problemContent("UpstreamProblem") },
}
