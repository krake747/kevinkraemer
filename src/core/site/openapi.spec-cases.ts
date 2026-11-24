import { openapiDocument } from "@core/site/openapi"
import type {
    HeaderParameterObject,
    OperationObject,
    ParameterObject,
    SchemaRefOrObject,
} from "@core/site/openapi-types"

export type ResponseValue = OperationObject["responses"][string]

export const PAGE_TAGS = ["Portfolio", "CV", "Logs", "Trust", "Docs"]

type PathEntry = { path: string; method: string; operation: OperationObject }

type PageEntry = { path: string; operation: OperationObject }

function getMethods(item: (typeof openapiDocument.paths)[string]): ("get" | "post")[] {
    return (["get", "post"] as const).filter((method) => item[method] !== undefined)
}

export function operations(): PathEntry[] {
    return Object.entries(openapiDocument.paths).flatMap(([path, item]) =>
        getMethods(item).flatMap((method) => {
            const operation = item[method]
            return operation ? [{ path, method, operation }] : []
        }),
    )
}

export function getOperation(path: string): OperationObject {
    const operation = openapiDocument.paths[path]?.get
    if (operation === undefined) {
        throw new Error(`Missing GET operation for ${path}`)
    }
    return operation
}

function isPageOperation(operation: OperationObject): boolean {
    return operation.tags.some((tag) => PAGE_TAGS.includes(tag))
}

function pageEntries(): PageEntry[] {
    return operations()
        .filter(({ operation }) => isPageOperation(operation))
        .map(({ path, operation }) => ({ path, operation }))
}

export function pageOperations(): PageEntry[] {
    return pageEntries().filter(({ operation }) => operation.operationId !== "getCvPdf")
}

export function inlineResponse(
    response: ResponseValue | undefined,
    context: string,
): Extract<ResponseValue, { description: string }> {
    if (response === undefined) {
        throw new Error(`${context} must declare a response`)
    }
    if ("$ref" in response) {
        throw new Error(`${context} must declare an inline response`)
    }
    return response
}

export function declared404Entries(): { path: string; response: ResponseValue }[] {
    return operations()
        .filter(({ operation }) => operation.responses["404"] !== undefined)
        .flatMap(({ path, operation }) => {
            const response = operation.responses["404"]
            return response === undefined ? [] : [{ path, response }]
        })
}

export function required<T>(value: T | undefined, context: string): T {
    if (value === undefined) {
        throw new Error(`${context} is not declared`)
    }
    return value
}

function inlineSchema(schema: SchemaRefOrObject, context: string): SchemaRefOrObject {
    if ("$ref" in schema) {
        throw new Error(`${context} must declare an inline schema`)
    }
    return schema
}

type AskPath = (typeof openapiDocument.paths)[string] | undefined

type McpPath = (typeof openapiDocument.paths)[string] | undefined

export function askOperationIds(ask: AskPath): (string | undefined)[] {
    return [ask?.get?.operationId, ask?.post?.operationId]
}

export function mcpOperationIds(mcp: McpPath): [unknown, string | undefined] {
    return [mcp?.get, mcp?.post?.operationId]
}

export function agentTags(ask: AskPath, mcp: McpPath): (string[] | undefined)[] {
    return [ask?.get?.tags, ask?.post?.tags, mcp?.post?.tags]
}

function successContentTypes(operation: OperationObject): string[] {
    const success = inlineResponse(operation.responses["200"], "filter")
    return Object.keys(success.content ?? {})
}

export function jsonEntries(): PathEntry[] {
    return operations().filter(({ operation }) => successContentTypes(operation).includes("application/json"))
}

export function negotiatedEntries(): PathEntry[] {
    return operations().filter(({ operation }) => successContentTypes(operation).includes("text/html"))
}

type ResolvedParameter = {
    ref: string | null
    resolved: ParameterObject | HeaderParameterObject | undefined
}

function allResolvedParameters(): ResolvedParameter[] {
    return operations()
        .flatMap(({ operation }) => operation.parameters ?? [])
        .map((parameter) => {
            if ("$ref" in parameter) {
                const name = parameter.$ref.split("/").pop() ?? ""
                return { ref: parameter.$ref, resolved: openapiDocument.components.parameters[name] }
            }
            return { ref: null, resolved: parameter }
        })
}

export function pageJsonCandidates(operation: OperationObject): SchemaRefOrObject[] {
    const success = inlineResponse(operation.responses["200"], "page json")
    const schema = success.content?.["application/json"]?.schema
    if (schema === undefined) {
        return []
    }
    return "$ref" in schema ? [schema] : (schema.oneOf ?? []).filter((entry) => typeof entry !== "boolean")
}

function isRef(value: unknown, ref: string): boolean {
    return typeof value === "object" && value !== null && "$ref" in value && value.$ref === ref
}

export function untypedSuccesses(): { path: string; media: string }[] {
    return operations().flatMap(({ path, operation }) => {
        const success = inlineResponse(operation.responses["200"], `${path} 200`)
        const entries = Object.entries(success.content ?? {})
        if (entries.length === 0) {
            return [{ path, media: "(none)" }]
        }
        return entries.filter(([, value]) => value?.schema === undefined).map(([media]) => ({ path, media }))
    })
}

export function badRateLimits(): string[] {
    return operations()
        .filter(({ path, operation }) => {
            const limited = inlineResponse(operation.responses["429"], `${path} 429`)
            return (
                limited.description.length <= 20 ||
                !isRef(
                    limited.content?.["application/problem+json"]?.schema,
                    "#/components/schemas/RateLimitedProblem",
                ) ||
                !isRef(limited.content?.["application/json"]?.schema, "#/components/schemas/RateLimitedProblem")
            )
        })
        .map(({ path }) => path)
}

export function badNotFounds(): string[] {
    return declared404Entries()
        .filter(({ path, response }) => {
            const notFound = inlineResponse(response, `${path} 404`)
            return (
                notFound.description.length <= 20 ||
                !isRef(
                    notFound.content?.["application/problem+json"]?.schema,
                    "#/components/schemas/NotFoundProblem",
                ) ||
                !isRef(notFound.content?.["application/json"]?.schema, "#/components/schemas/NotFoundProblem")
            )
        })
        .map(({ path }) => path)
}

type DeclaredParameter = ParameterObject | HeaderParameterObject

function parameterNameIssues(parameter: DeclaredParameter): string[] {
    return parameter.name.length === 0 ? ["parameter without name"] : []
}

function parameterDescriptionIssues(parameter: DeclaredParameter): string[] {
    return parameter.description.length === 0 ? [`parameter ${parameter.name} without description`] : []
}

function parameterSchemaIssues(parameter: DeclaredParameter): string[] {
    try {
        inlineSchema(parameter.schema, `parameter ${parameter.name}`)
        return []
    } catch {
        return [`parameter ${parameter.name} without inline schema`]
    }
}

function describeParameter(parameter: DeclaredParameter): string[] {
    return [
        ...parameterNameIssues(parameter),
        ...parameterDescriptionIssues(parameter),
        ...parameterSchemaIssues(parameter),
    ]
}

function pathParameterIssues(parameter: DeclaredParameter): string[] {
    return parameter.in === "path" && !parameter.required ? [`path parameter ${parameter.name} is optional`] : []
}

export function parameterIssues(): string[] {
    const resolved = allResolvedParameters()
    if (resolved.length === 0) {
        return ["no parameters declared"]
    }
    const parameters = resolved.map(({ ref, resolved: value }) => required(value, `parameter ${ref ?? "inline"}`))
    const pathParameters = parameters.filter((parameter) => parameter.in === "path")
    const missingPath = pathParameters.length === 0 ? ["no path parameters declared"] : []
    return [...parameters.flatMap(describeParameter), ...missingPath, ...pathParameters.flatMap(pathParameterIssues)]
}

export function schemaIssues(): string[] {
    return Object.entries(openapiDocument.components.schemas).flatMap(([name, schema]) =>
        schemaEntryIssues(name, schema),
    )
}

function schemaEntryIssues(name: string, schema: SchemaRefOrObject): string[] {
    const resolved = inlineSchema(schema, `schema ${name}`)
    const missing = (resolved.description?.length ?? 0) === 0 ? [`schema ${name} without description`] : []
    return [...missing, ...propertyIssues(name, resolved)]
}

function propertyIssues(name: string, resolved: SchemaRefOrObject): string[] {
    return Object.entries(resolved.properties ?? {}).flatMap(([property, value]) =>
        typeof value === "boolean" ? [] : propertyEntryIssues(name, property, value),
    )
}

function propertyEntryIssues(name: string, property: string, value: SchemaRefOrObject): string[] {
    const propertySchema = inlineSchema(value, `${name}.${property}`)
    const missingDescription =
        (propertySchema.description?.length ?? 0) === 0 ? [`schema ${name}.${property} without description`] : []
    const missingType = "type" in propertySchema ? [] : [`schema ${name}.${property} without type`]
    return [...missingDescription, ...missingType]
}
