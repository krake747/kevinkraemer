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
    const methods: ("get" | "post")[] = []
    if (item.get !== undefined) {
        methods.push("get")
    }
    if (item.post !== undefined) {
        methods.push("post")
    }
    return methods
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

export function parameterIssues(): string[] {
    const resolved = allResolvedParameters()
    if (resolved.length === 0) {
        return ["no parameters declared"]
    }
    const issues: string[] = []
    const parameters = resolved.map(({ ref, resolved: value }) => required(value, `parameter ${ref ?? "inline"}`))
    for (const parameter of parameters) {
        if (parameter.name.length === 0) {
            issues.push("parameter without name")
        }
        if (parameter.description.length === 0) {
            issues.push(`parameter ${parameter.name} without description`)
        }
        try {
            inlineSchema(parameter.schema, `parameter ${parameter.name}`)
        } catch {
            issues.push(`parameter ${parameter.name} without inline schema`)
        }
    }
    const pathParameters = parameters.filter((parameter) => parameter.in === "path")
    if (pathParameters.length === 0) {
        issues.push("no path parameters declared")
    }
    for (const parameter of pathParameters) {
        if (!parameter.required) {
            issues.push(`path parameter ${parameter.name} is optional`)
        }
    }
    return issues
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
    const issues: string[] = []
    if ((propertySchema.description?.length ?? 0) === 0) {
        issues.push(`schema ${name}.${property} without description`)
    }
    if (!("type" in propertySchema)) {
        issues.push(`schema ${name}.${property} without type`)
    }
    return issues
}
