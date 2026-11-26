import { ASK_QUESTION_MAX_LENGTH, ASK_QUESTION_MIN_LENGTH } from "@core/ask/request"
import {
    methodNotAllowedInline,
    negotiatedPageGet,
    postJsonOperation,
    staticFileGet,
    unavailableInline,
} from "@core/site/openapi-operations"
import {
    apiVersionHeader,
    apiVersionParameterRef,
    notFoundInline,
    problemContent,
    rateLimitedInline,
    upstreamErrorResponse,
} from "@core/site/openapi-responses"
import type { PathItemObject } from "@core/site/openapi-types"
import { CV_PDF_PATH } from "@core/site/urls"

type CatalogFacts = {
    type: string
    rel: string
    title: string
    description: string
}

type HeaderFacts = {
    contentType?: string
}

export type Endpoint = {
    path: string
    operation: PathItemObject
    catalog?: CatalogFacts
    headers?: HeaderFacts
}

export const endpoints: Endpoint[] = [
    {
        path: "/.well-known/api-catalog",
        catalog: {
            type: "application/linkset+json",
            rel: "self",
            title: "This catalog",
            description: "RFC 9264 linkset listing all machine-readable endpoints",
        },
        headers: { contentType: "application/linkset+json" },
        operation: staticFileGet({
            operationId: "getApiCatalog",
            summary: "API catalog linkset",
            description:
                "RFC 9264 linkset (application/linkset+json) listing every machine-readable endpoint with IANA rel types such as service-desc and sitemap.",
            tag: "Discovery",
            contentType: "application/linkset+json",
            schemaDescription: "JSON linkset document per RFC 9264.",
        }),
    },
    {
        path: "/.well-known/ard.json",
        catalog: {
            type: "application/json",
            rel: "describedby",
            title: "ARD manifest: this site's discoverable agentic resources",
            description: "Agentic Resource Discovery manifest naming the MCP resource and the queries it answers",
        },
        headers: {},
        operation: staticFileGet({
            operationId: "getArdManifest",
            summary: "Agentic Resource Discovery manifest",
            description:
                "ARD v0.91 manifest whose entries name this site's discoverable agentic resources with the sample queries a registry indexes. Fetch it to learn which capabilities the site offers without crawling.",
            tag: "Discovery",
            contentType: "application/json",
            schemaDescription: "ARD manifest: an entries array of ARD entries.",
        }),
    },
    {
        path: "/.well-known/agent-skills/index.json",
        catalog: {
            type: "application/json",
            rel: "describedby",
            title: "Agent Skills Discovery index",
            description: "Installable skill that tells an agent how to find, read, and cite this site",
        },
        headers: {},
        operation: staticFileGet({
            operationId: "getAgentSkillsIndex",
            summary: "Agent Skills Discovery index",
            description:
                "Agent Skills Discovery 0.2.0 index listing one skill, kevinkraemer-com, with its description, URL, and sha256 digest. An agent that installs it learns where the writing lives and how to cite it.",
            tag: "Agents",
            contentType: "application/json",
            schemaDescription: "Agent Skills Discovery index with a skills array.",
        }),
    },
    {
        path: "/mcp/server-card",
        catalog: {
            type: "application/mcp-server-card+json",
            rel: "service-desc",
            title: "MCP Server Card for the /mcp endpoint",
            description: "MCP Server Card: transport, protocol versions, and identity, readable before connecting",
        },
        headers: {},
        operation: staticFileGet({
            operationId: "getMcpServerCard",
            summary: "MCP Server Card",
            description:
                "MCP Server Card for the /mcp endpoint: server name, version, streamable-HTTP transport, and supported protocol versions. Read it before connecting.",
            tag: "Agents",
            contentType: "application/mcp-server-card+json",
            schemaDescription: "MCP Server Card per the MCP Server Card extension.",
        }),
    },
    {
        path: "/openapi.json",
        catalog: {
            type: "application/json",
            rel: "service-desc",
            title: "OpenAPI specification of this site's retrieval API",
            description: "OpenAPI specification describing this site's retrieval API",
        },
        headers: {},
        operation: staticFileGet({
            operationId: "getOpenapiDocument",
            summary: "This OpenAPI document",
            description:
                "This specification, served as application/json. Self-describing: fetch it to learn every other endpoint.",
            tag: "Discovery",
            contentType: "application/json",
            schemaDescription: "OpenAPI document.",
        }),
    },
    {
        path: "/llms.txt",
        catalog: {
            type: "text/plain",
            rel: "describedby",
            title: "llms.txt site index written for agents",
            description: "Site index written for agents, including when-to-use guidance",
        },
        headers: {},
        operation: staticFileGet({
            operationId: "getLlmsTxt",
            summary: "Agent-oriented site index",
            description:
                "Markdown index written for language models: when to use this site, canonical page URLs, machine-readable files, and retrieval instructions. Best first request for an agent.",
            tag: "Discovery",
            contentType: "text/plain",
            schemaDescription: "llms.txt markdown document.",
            jsonEnvelope: true,
        }),
    },
    {
        path: "/llms-full.txt",
        catalog: {
            type: "text/plain",
            rel: "describedby",
            title: "Full content archive: every log entry in one file",
            description: "Every log entry in one plain-text file for AI retrieval",
        },
        headers: {},
        operation: staticFileGet({
            operationId: "getFullContentArchive",
            summary: "Full content archive",
            description:
                "Every log entry concatenated in one plain-text file with titles, dates, URLs, and tags. Fetch once to read all writing without crawling.",
            tag: "Discovery",
            contentType: "text/plain",
            schemaDescription: "Concatenated archive; entries separated by '---' rules.",
            jsonEnvelope: true,
        }),
    },
    {
        path: "/logs-llms.txt",
        catalog: {
            type: "text/plain",
            rel: "describedby",
            title: "Logs section guide for agents",
            description: "Section guide for log entries: index, retrieval, and citations",
        },
        headers: {},
        operation: staticFileGet({
            operationId: "getLogsSectionGuide",
            summary: "Logs section guide",
            description:
                "Scoped index for log entries: index, retrieval instructions, and entry discovery. Fetch this instead of the full site index when the question is about the writing.",
            tag: "Discovery",
            contentType: "text/plain",
            schemaDescription: "logs-llms.txt section guide.",
            jsonEnvelope: true,
        }),
    },
    {
        path: "/rss.xml",
        catalog: {
            type: "application/rss+xml",
            rel: "alternate",
            title: "Logs RSS feed",
            description: "RSS feed of log entries",
        },
        headers: {},
        operation: staticFileGet({
            operationId: "getLogsRssFeed",
            summary: "RSS feed of log entries",
            description: "RSS 2.0 feed listing log entries newest first with permalinks and publication dates.",
            tag: "Feeds",
            contentType: "application/rss+xml",
            schemaDescription: "XML RSS 2.0 document.",
            jsonEnvelope: true,
        }),
    },
    {
        path: "/sitemap-index.xml",
        catalog: {
            type: "application/xml",
            rel: "sitemap",
            title: "Sitemap of all indexed pages",
            description: "Sitemap of all indexed pages",
        },
        headers: {},
        operation: staticFileGet({
            operationId: "getSitemapIndex",
            summary: "Sitemap index",
            description:
                "Sitemap index enumerating every indexed page URL. Authoritative answer to 'does this path exist'.",
            tag: "Discovery",
            contentType: "application/xml",
            schemaDescription: "XML sitemapindex document.",
            jsonEnvelope: true,
        }),
    },
    {
        path: "/robots.txt",
        catalog: {
            type: "text/plain",
            rel: "describedby",
            title: "Crawler permissions and sitemap pointer",
            description: "Crawler permissions and sitemap pointer",
        },
        headers: {},
        operation: staticFileGet({
            operationId: "getRobotsTxt",
            summary: "Crawler permissions",
            description: "Explicit Allow rules for major and AI crawlers (all paths allowed) plus the sitemap pointer.",
            tag: "Discovery",
            contentType: "text/plain",
            schemaDescription: "robots.txt directives.",
            jsonEnvelope: true,
        }),
    },
    {
        path: "/developers",
        catalog: {
            type: "text/html",
            rel: "service-doc",
            title: "Developer documentation: endpoints and retrieval quickstart",
            description: "Developer documentation and retrieval quickstart",
        },
        operation: negotiatedPageGet({
            tag: "Docs",
            operationId: "getDevelopersPage",
            summary: "Developer documentation",
            description:
                "Lists every machine-readable endpoint with curl examples, the JSON error shape, and caching rules. Start here when integrating against this site programmatically.",
        }),
    },
    {
        path: "/scalar",
        catalog: {
            type: "text/html",
            rel: "service-doc",
            title: "API Reference: interactive docs for the retrieval API",
            description:
                "Interactive reference for the kevinkraemer.com retrieval API: content negotiation, agent endpoints, the ask API, and the MCP server.",
        },
        operation: negotiatedPageGet({
            tag: "Docs",
            operationId: "getScalarReference",
            summary: "Interactive API reference",
            description:
                "Scalar-rendered interactive reference for the OpenAPI document: try the retrieval endpoints from the browser. Prefers documentation reading over raw JSON.",
        }),
    },
    {
        path: "/logs",
        catalog: {
            type: "text/html",
            rel: "related",
            title: "Logs: writing on software, type systems, and finance",
            description: "Writing index: architectural notes, type systems, and lessons from finance",
        },
        operation: negotiatedPageGet({
            tag: "Logs",
            operationId: "getLogsIndex",
            summary: "Writing index",
            description:
                "All log entries newest first, with titles, dates, and reading times. Entry bodies live at /logs/{slug}.",
        }),
    },
    {
        path: "/cv",
        catalog: {
            type: "text/html",
            rel: "related",
            title: "Curriculum vitae",
            description: "Curriculum vitae",
        },
        operation: negotiatedPageGet({
            tag: "CV",
            operationId: "getCvPage",
            summary: "Curriculum vitae",
            description:
                "Verified career facts: experience timeline, skills, projects, education, and links to the printable PDF. Prefer this page when fact-checking employment claims.",
        }),
    },
    {
        path: "/about",
        catalog: {
            type: "text/html",
            rel: "related",
            title: "About Kevin Kraemer: background, current role, and philosophy",
            description: "Who Kevin Kraemer is: background, current role, and philosophy",
        },
        operation: negotiatedPageGet({
            tag: "Trust",
            operationId: "getAboutPage",
            summary: "About Kevin Kraemer",
            description:
                "Who Kevin is: background in financial risk analysis, move to full-stack engineering, and what shapes his work. Canonical biography source.",
        }),
    },
    {
        path: "/contact",
        catalog: {
            type: "text/html",
            rel: "related",
            title: "Contact channels and response expectations",
            description: "Contact channels and response expectations",
        },
        operation: negotiatedPageGet({
            tag: "Trust",
            operationId: "getContactPage",
            summary: "Contact channels",
            description:
                "Email address, GitHub, LinkedIn, location (Luxembourg), and response-time expectations. Use for outreach rather than guessing addresses.",
        }),
    },
    {
        path: "/privacy",
        catalog: {
            type: "text/html",
            rel: "related",
            title: "Data handling statement: no analytics, no tracking, no cookies",
            description: "Data handling statement: no analytics, no tracking, no cookies",
        },
        operation: negotiatedPageGet({
            tag: "Trust",
            operationId: "getPrivacyPage",
            summary: "Privacy statement",
            description:
                "Data handling facts: static output, no analytics, no tracking, no cookies, localStorage limited to the theme preference, Netlify request logs.",
        }),
    },
    {
        path: CV_PDF_PATH,
        catalog: {
            type: "application/pdf",
            rel: "related",
            title: "Curriculum vitae (PDF)",
            description: "Printable CV",
        },
        operation: staticFileGet({
            operationId: "getCvPdf",
            summary: "Printable CV (PDF)",
            description: "The curriculum vitae as a print-ready PDF. Same facts as the /cv page in a portable format.",
            tag: "CV",
            contentType: "application/pdf",
            schemaDescription: "PDF binary.",
            binary: true,
        }),
    },
    {
        path: "/uses",
        catalog: {
            type: "text/html",
            rel: "related",
            title: "Uses: tools, runtimes, hardware and more",
            description: "Tools, runtimes, hardware and more that shape the work. cat uses.md",
        },
        operation: negotiatedPageGet({
            tag: "Portfolio",
            operationId: "getUsesPage",
            summary: "Uses",
            description:
                "Tools, runtimes, hardware and more that shape the work. The cat uses.md ledger. Grouped as workspace, development, AI and agents, and exploring, with one-line notes and links.",
        }),
    },
    {
        path: "/projects",
        catalog: {
            type: "text/html",
            rel: "related",
            title: "Projects: case files",
            description: "Case files for selected projects. ls ~/projects",
        },
        operation: negotiatedPageGet({
            tag: "Portfolio",
            operationId: "getProjectsIndex",
            summary: "Projects index",
            description:
                "Case files for selected projects: name, one-line what, category, status, and year or stack, each linking to a case page at /projects/{slug}.",
        }),
    },
    {
        path: "/",
        operation: negotiatedPageGet({
            tag: "Portfolio",
            operationId: "getHomePage",
            summary: "Portfolio landing page",
            description:
                "Hero, story, contact, and logs sections in one page. Section anchors: /#story, /#contact. Append ?mode=agent for a structured JSON inventory of endpoints, authentication, and capabilities.",
            agentMode: true,
        }),
    },
    {
        path: "/logs/{slug}",
        operation: negotiatedPageGet({
            tag: "Logs",
            operationId: "getLogEntry",
            summary: "Single log entry",
            description:
                "One log entry from the Logs archive in full. Slugs are stable; discover them via getLogsRssFeed, getSitemapIndex, or getLogsIndex. The authored Markdown version lives at /logs/{slug}.md with YAML front matter and absolute links.",
            parameters: [
                {
                    name: "slug",
                    in: "path",
                    required: true,
                    description: "URL slug of the log entry, e.g. something-visible.",
                    schema: { type: "string", pattern: "^[a-z0-9-]+$" },
                    example: "something-visible",
                },
            ],
        }),
    },
    {
        path: "/projects/{slug}",
        operation: negotiatedPageGet({
            tag: "Portfolio",
            operationId: "getProjectCase",
            summary: "Project case file",
            description:
                "One project case file: metadata, problem and point of view, key decisions, technical implementation, evidence, challenges and trade-offs, and links and resources. Slugs are stable; discover them via getProjectsIndex or getSitemapIndex.",
            parameters: [
                {
                    name: "slug",
                    in: "path",
                    required: true,
                    description: "URL slug of the case file, e.g. kevinkraemer-com.",
                    schema: { type: "string", pattern: "^[a-z0-9-]+$" },
                    example: "kevinkraemer-com",
                },
            ],
        }),
    },
    {
        path: "/ask",
        operation: {
            get: {
                operationId: "getAskAnswer",
                summary: "Ask · query string",
                description:
                    "Answer a plain-language question from the site's published content, with cited source URLs and an optional prose summary. Prefer this over crawling when the question is about Kevin.",
                tags: ["Agents"],
                parameters: [
                    {
                        name: "question",
                        in: "query",
                        required: true,
                        description: `Plain-language question, up to ${ASK_QUESTION_MAX_LENGTH} characters.`,
                        schema: {
                            type: "string",
                            minLength: ASK_QUESTION_MIN_LENGTH,
                            maxLength: ASK_QUESTION_MAX_LENGTH,
                        },
                        example: "What did Kevin build at Dennemeyer?",
                    },
                    {
                        name: "summarize",
                        in: "query",
                        required: false,
                        description:
                            "Set to false for matching pages only; omit or set true for pages plus a written answer.",
                        schema: { type: "boolean" },
                        example: "true",
                    },
                    apiVersionParameterRef,
                ],
                responses: {
                    "200": {
                        summary: "The answer",
                        description:
                            "The matching tape prints and, unless summarize=false, a prose answer grounded in them.",
                        headers: { "API-Version": apiVersionHeader },
                        content: { "application/json": { schema: { $ref: "#/components/schemas/AskResponse" } } },
                    },
                    "400": {
                        summary: "Invalid question",
                        description: `The question failed validation (missing, blank, or over ${ASK_QUESTION_MAX_LENGTH} characters); JSON variant carries code INVALID_QUESTION.`,
                        content: { ...problemContent("UpstreamProblem") },
                    },
                    ...notFoundInline(
                        "Markdown notice titled '# Not Found' linking llms.txt and the sitemap; JSON variant carries code NOT_FOUND when no page answers the question.",
                    ),
                    ...rateLimitedInline(),
                    "502": upstreamErrorResponse,
                    ...unavailableInline(),
                    ...methodNotAllowedInline("GET, POST, OPTIONS"),
                },
            },
            post: postJsonOperation({
                operationId: "postAskAnswer",
                summary: "Ask · JSON body",
                description:
                    "Same contract as GET /ask, with the question in a JSON body instead of the query string. Prefer this when the question is long or contains characters awkward in URLs.",
                requestDescription: "Question to answer from the site's published content.",
                requestSchema: { $ref: "#/components/schemas/AskRequest" },
                responseDescription:
                    "The matching tape prints and, unless summarize is false, a prose answer grounded in them.",
                responseSchema: { $ref: "#/components/schemas/AskResponse" },
                badRequestDescription:
                    "The body failed validation (missing, blank, or overlong question); JSON variant carries code INVALID_QUESTION.",
                notFoundDescription: "JSON variant carries code NOT_FOUND when no page answers the question.",
                extraResponses: {
                    "502": upstreamErrorResponse,
                    ...unavailableInline(),
                    ...methodNotAllowedInline("GET, POST, OPTIONS"),
                },
            }),
        },
    },
    {
        path: "/mcp",
        operation: {
            post: postJsonOperation({
                operationId: "postMcpMessage",
                summary: "Model Context Protocol endpoint",
                description:
                    "Streamable MCP endpoint: initialize, list tools and resources, call the ask tool, and read every page as a text/markdown resource. MCP clients should prefer this over scraping HTML.",
                requestDescription:
                    "A JSON-RPC 2.0 MCP message: initialize, tools/list, tools/call, resources/list, or resources/read.",
                requestSchema: { $ref: "#/components/schemas/McpRequest" },
                responseDescription: "A JSON-RPC 2.0 response carrying the result or a protocol error.",
                responseSchema: { $ref: "#/components/schemas/McpResponse" },
                badRequestDescription:
                    "Malformed JSON-RPC bodies are rejected; JSON variant carries the parse or validation error.",
                extraResponses: { ...methodNotAllowedInline("POST, OPTIONS") },
            }),
        },
    },
]
