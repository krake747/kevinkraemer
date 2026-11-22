import { apiVersion } from "@core/site/api-version"
import { endpoints } from "@core/site/endpoints"
import {
    apiVersionHeaderParameter,
    invalidRequestProblemSchema,
    methodNotAllowedProblemSchema,
    notFoundProblemSchema,
    notFoundResponse,
    rateLimitedProblemSchema,
    rateLimitedResponse,
    unavailableProblemSchema,
    upstreamErrorResponse,
    upstreamProblemSchema,
} from "@core/site/openapi-responses"
import {
    agentViewSchema,
    askRequestDocumentSchema,
    askResponseSchema,
    askSourceSchema,
    fileDescriptorSchema,
    mcpRequestSchema,
    mcpResponseSchema,
    pageDescriptorSchema,
    problemSchema,
} from "@core/site/openapi-schemas"
import { OPENAPI_VERSION, type OpenApiDocument } from "@core/site/openapi-types"
import { DEPRECATION_SUNSET_DAYS } from "@core/site/policy"
import { origin as ORIGIN } from "@core/site/urls"

export const openapiDocument: OpenApiDocument = {
    openapi: OPENAPI_VERSION,
    $self: `${ORIGIN}/openapi.json`,
    info: {
        title: "Kevin Kraemer · kevinkraemer.com",
        summary: "Read-only content retrieval for agents, plus an ask endpoint and an MCP server.",
        description:
            "Kevin Kraemer's portfolio as a public, read-only API. No keys, no accounts, no writes.\n\n" +
            "**Every page** answers in three representations:\n\n" +
            "- HTML by default\n" +
            "- GitHub-flavored markdown for `Accept: text/markdown`\n" +
            "- a typed JSON descriptor for `Accept: application/json`\n\n" +
            "Discovery files also serve a `FileDescriptor` envelope. Responses carry `Vary: Accept, Accept-Encoding`, so cache per representation.\n\n" +
            "**Errors and limits**\n\n" +
            "- Unknown paths return real 404s as RFC 9457 problems, with a stable `code` and a `hint` pointing at `/llms.txt`\n" +
            "- `/api/*` and `/v1/*` always answer JSON-first\n" +
            "- Rate limits apply per address to pages and API paths and are reported by `RateLimit-*` headers, with `Retry-After` on 429; static assets are unmetered\n\n" +
            "**Versioning**\n\n" +
            "- `API-Version` (currently " +
            apiVersion +
            ") is echoed on every machine-readable response\n" +
            "- changes are additively only\n" +
            "- a deprecated endpoint carries `Deprecation: true` plus a `Sunset` date at least " +
            DEPRECATION_SUNSET_DAYS +
            " days out\n\n" +
            "The financial-market presentation across the site is a design metaphor: no market data is real or live.",
        version: apiVersion,
        contact: { name: "Kevin Kraemer", url: `${ORIGIN}/contact` },
        license: { name: "Mozilla Public License 2.0", identifier: "MPL-2.0" },
    },
    externalDocs: { url: `${ORIGIN}/developers`, description: "Developer documentation and retrieval quickstart" },
    servers: [{ url: ORIGIN, description: "Canonical origin; every other origin redirects here." }],
    tags: [
        {
            name: "Pages",
            summary: "Human pages",
            description: "The site itself: every page renders for people and negotiates HTML, markdown, or JSON.",
        },
        {
            name: "Portfolio",
            summary: "Landing and tools",
            description: "The landing page and the tool ledger.",
            parent: "Pages",
        },
        {
            name: "CV",
            summary: "Career record",
            description: "Experience, skills, projects, education, and the printable PDF.",
            parent: "Pages",
        },
        {
            name: "Logs",
            summary: "Writing",
            description: "The index of log entries and any single entry in full.",
            parent: "Pages",
        },
        {
            name: "Trust",
            summary: "Who and how to reach him",
            description: "Background, contact channels, and data handling.",
            parent: "Pages",
        },
        {
            name: "Docs",
            summary: "How to use this API",
            description: "The developer documentation page.",
            parent: "Pages",
        },
        {
            name: "Discovery",
            summary: "Indexes for machines",
            description: "Machine-readable indexes describing or listing site content.",
        },
        {
            name: "Feeds",
            summary: "Syndication",
            description: "Change tracking for the writing.",
        },
        {
            name: "Agents",
            summary: "Ask and MCP",
            description: "Interactive endpoints: plain-language answers and the MCP server.",
        },
    ],
    paths: Object.fromEntries(endpoints.map((endpoint) => [endpoint.path, endpoint.operation])),
    components: {
        schemas: {
            Problem: problemSchema,
            NotFoundProblem: notFoundProblemSchema,
            RateLimitedProblem: rateLimitedProblemSchema,
            UpstreamProblem: upstreamProblemSchema,
            UnavailableProblem: unavailableProblemSchema,
            InvalidRequestProblem: invalidRequestProblemSchema,
            MethodNotAllowedProblem: methodNotAllowedProblemSchema,
            PageDescriptor: pageDescriptorSchema,
            FileDescriptor: fileDescriptorSchema,
            AgentView: agentViewSchema,
            AskRequest: askRequestDocumentSchema,
            AskSource: askSourceSchema,
            AskResponse: askResponseSchema,
            McpRequest: mcpRequestSchema,
            McpResponse: mcpResponseSchema,
        },
        responses: {
            NotFound: notFoundResponse,
            RateLimited: rateLimitedResponse,
            UpstreamError: upstreamErrorResponse,
        },
        parameters: { ApiVersionHeader: apiVersionHeaderParameter },
    },
}

export const openapiJson = JSON.stringify(openapiDocument, null, 2)
