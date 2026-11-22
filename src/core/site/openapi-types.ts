import type { JsonSchema } from "@valibot/to-json-schema"

export const OPENAPI_VERSION = "3.2.0"

export type SchemaRefOrObject = JsonSchema & { example?: string }

export type ResponseHeader = {
    description: string
    schema: SchemaRefOrObject
}

export type ResponseObject = {
    summary?: string
    description: string
    headers?: Record<string, ResponseHeader>
    content?: Record<string, { schema: SchemaRefOrObject }>
}

export type ParameterObject = {
    name: string
    in: "path" | "query"
    required: boolean
    description: string
    schema: SchemaRefOrObject
    example?: string
}

export type HeaderParameterObject = {
    name: string
    in: "header"
    required: false
    description: string
    schema: SchemaRefOrObject
    example?: string
}

export type ParameterReference = { $ref: string }

export type RequestBodyObject = {
    description: string
    required: boolean
    content: Record<string, { schema: SchemaRefOrObject }>
}

export type OperationObject = {
    operationId: string
    summary: string
    description: string
    tags: string[]
    parameters?: (ParameterObject | HeaderParameterObject | ParameterReference)[]
    requestBody?: RequestBodyObject
    responses: Record<string, ResponseObject | { $ref: string }>
}

export type PathItemObject = {
    get?: OperationObject
    post?: OperationObject
    query?: OperationObject
}

export type OpenApiDocument = {
    openapi: typeof OPENAPI_VERSION
    $self: string
    info: {
        title: string
        summary: string
        description: string
        version: string
        contact: { name: string; url: string }
        license: { name: string; identifier: string }
    }
    externalDocs: { url: string; description: string }
    servers: { url: string; description: string }[]
    tags: { name: string; summary: string; description: string; parent?: string }[]
    paths: Record<string, PathItemObject>
    components: {
        schemas: Record<string, SchemaRefOrObject>
        responses: Record<string, ResponseObject>
        parameters: Record<string, HeaderParameterObject>
    }
}
