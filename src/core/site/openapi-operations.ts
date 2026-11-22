import {
    apiVersionHeader,
    apiVersionParameterRef,
    deprecationHeaders,
    notFoundInline,
    problemContent,
    rateLimitedInline,
    upstreamErrorResponse,
    varyHeader,
} from "@core/site/openapi-responses"
import type { OperationObject, ParameterObject, ResponseObject, SchemaRefOrObject } from "@core/site/openapi-types"

type PageOperationInput = {
    operationId: string
    summary: string
    description: string
    tag: PageTag
    parameters?: ParameterObject[]

    agentMode?: boolean
}

type PageTag = "Portfolio" | "CV" | "Logs" | "Trust" | "Docs"

type FileOperationInput = {
    operationId: string
    summary: string
    description: string
    tag: PageTag | "Discovery" | "Feeds" | "Agents"
    contentType: string
    schemaDescription: string
    binary?: boolean

    jsonEnvelope?: boolean
}

export function negotiatedPageGet(input: PageOperationInput): { get: OperationObject } {
    const jsonSchema: SchemaRefOrObject = input.agentMode
        ? {
              description:
                  "Selected by query string: the JSON page descriptor by default, or the AgentView inventory when ?mode=agent is present.",
              oneOf: [{ $ref: "#/components/schemas/PageDescriptor" }, { $ref: "#/components/schemas/AgentView" }],
          }
        : { $ref: "#/components/schemas/PageDescriptor" }
    const modeParameter: ParameterObject[] = input.agentMode
        ? [
              {
                  name: "mode",
                  in: "query",
                  required: false,
                  description:
                      "Set to agent on the homepage to receive a structured JSON inventory (endpoints with operation IDs, authentication info, rate limits, and key capabilities) instead of marketing HTML.",
                  schema: { type: "string", enum: ["agent"] },
                  example: "agent",
              },
          ]
        : []
    return {
        get: {
            operationId: input.operationId,
            summary: input.summary,
            description: input.description,
            tags: [input.tag],
            parameters: [...(input.parameters ?? []), ...modeParameter, apiVersionParameterRef],
            responses: {
                "200": {
                    summary: "The page",
                    description: "The page in the representation selected by `Accept`.",
                    headers: { Vary: varyHeader, "API-Version": apiVersionHeader, ...deprecationHeaders },
                    content: {
                        "text/html": {
                            schema: {
                                type: "string",
                                description: "The rendered page, with site navigation and chrome.",
                            },
                        },
                        "text/markdown": {
                            schema: {
                                type: "string",
                                description:
                                    "The same content as GitHub-flavored markdown, with navigation and footer chrome removed.",
                            },
                        },
                        "application/json": { schema: jsonSchema },
                    },
                },
                ...notFoundInline(
                    "Markdown notice titled '# Not Found' linking llms.txt, the sitemap, logs, and developer docs.",
                ),
                ...rateLimitedInline(),
                "502": upstreamErrorResponse,
            },
        },
    }
}

export function staticFileGet(input: FileOperationInput): { get: OperationObject } {
    const fileContent: Record<string, { schema: SchemaRefOrObject }> = {
        [input.contentType]: {
            schema: {
                type: "string",
                format: input.binary ? "binary" : undefined,
                description: input.schemaDescription,
            },
        },
    }
    if (input.jsonEnvelope === true) {
        fileContent["application/json"] = { schema: { $ref: "#/components/schemas/FileDescriptor" } }
    }
    return {
        get: {
            operationId: input.operationId,
            summary: input.summary,
            description: input.description,
            tags: [input.tag],
            parameters: [apiVersionParameterRef],
            responses: {
                "200": {
                    summary: "The file",
                    description: `The file verbatim as ${input.contentType}${input.jsonEnvelope ? ", or as a typed JSON FileDescriptor envelope for Accept: application/json" : ""}.`,
                    headers: { "API-Version": apiVersionHeader, ...deprecationHeaders },
                    content: fileContent,
                },
                ...notFoundInline("Markdown notice titled '# Not Found' linking llms.txt and the sitemap."),
                ...rateLimitedInline(),
            },
        },
    }
}

export function methodNotAllowedInline(allow: string): Record<string, ResponseObject> {
    return {
        "405": {
            summary: "Method not allowed",
            description: `Only ${allow} are accepted. The \`Allow\` header repeats them.`,
            headers: {
                Allow: {
                    description: "Methods this resource accepts.",
                    schema: { type: "string" },
                },
            },
            content: { ...problemContent("MethodNotAllowedProblem") },
        },
    }
}

export function unavailableInline(): Record<string, ResponseObject> {
    return {
        "503": {
            summary: "Ask unavailable",
            description:
                "The ask endpoint is not configured on this deploy: TYPESAFE_API_KEY or OPENAI_API_KEY is missing. Only possible before secrets are wired up.",
            content: { ...problemContent("UnavailableProblem") },
        },
    }
}

type PostOperationInput = {
    operationId: string
    summary: string
    description: string
    requestDescription: string
    requestSchema: SchemaRefOrObject
    responseDescription: string
    responseSchema: SchemaRefOrObject
    badRequestDescription: string
    notFoundDescription?: string
    extraResponses?: Record<string, ResponseObject | { $ref: string }>
}

export function postJsonOperation(input: PostOperationInput): OperationObject {
    const notFound = input.notFoundDescription === undefined ? undefined : notFoundInline(input.notFoundDescription)
    const extra = input.extraResponses
    return {
        operationId: input.operationId,
        summary: input.summary,
        description: input.description,
        tags: ["Agents"],
        parameters: [apiVersionParameterRef],
        requestBody: {
            description: input.requestDescription,
            required: true,
            content: { "application/json": { schema: input.requestSchema } },
        },
        responses: {
            "200": {
                summary: "The answer",
                description: input.responseDescription,
                headers: { "API-Version": apiVersionHeader },
                content: { "application/json": { schema: input.responseSchema } },
            },
            "400": {
                summary: "Invalid request",
                description: input.badRequestDescription,
                content: { ...problemContent("InvalidRequestProblem") },
            },
            ...notFound,
            ...rateLimitedInline(),
            ...extra,
        },
    }
}
