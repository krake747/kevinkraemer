import { apiVersion } from "@core/site/api-version"
import { catalogEntries } from "@core/site/catalog"
import { openapiDocument } from "@core/site/openapi"
import { pageDescriptorSchema, problemSchema } from "@core/site/openapi-schemas"
import {
    agentTags,
    askOperationIds,
    badNotFounds,
    badRateLimits,
    declared404Entries,
    getOperation,
    inlineResponse,
    jsonEntries,
    mcpOperationIds,
    negotiatedEntries,
    operations,
    pageJsonCandidates,
    pageOperations,
    parameterIssues,
    required,
    schemaIssues,
    untypedSuccesses,
    PAGE_TAGS,
} from "@core/site/openapi.spec-cases"
import { DEPRECATION_SUNSET_DAYS } from "@core/site/policy"
import { describe, expect, it } from "vite-plus/test"

function assertSuccessTyped(): void {
    expect(untypedSuccesses()).toEqual([])
}

function assertRateLimitedShape(): void {
    expect(badRateLimits()).toEqual([])
}

function assertNotFoundShape(): void {
    expect(badNotFounds()).toEqual([])
}

describe("openapi document", () => {
    it("declares the OpenAPI version with a self URI and SPDX license", () => {
        expect(openapiDocument.openapi).toBe("3.2.0")
        expect(openapiDocument.$self).toBe("https://www.kevinkraemer.com/openapi.json")
        expect(openapiDocument.info.license).toEqual({
            name: "Mozilla Public License 2.0",
            identifier: "MPL-2.0",
        })
    })

    it("nests page tags under a parent and gives every tag a summary", () => {
        const byName = new Map(openapiDocument.tags.map((tag) => [tag.name, tag]))
        expect(byName.get("Pages")?.parent).toBeUndefined()
        const children = ["Portfolio", "CV", "Logs", "Trust", "Docs"].map(
            (name) => `${name}:${byName.get(name)?.parent ?? "none"}`,
        )
        expect(children).toEqual(["Portfolio:Pages", "CV:Pages", "Logs:Pages", "Trust:Pages", "Docs:Pages"])
        const withoutSummary = openapiDocument.tags.filter((tag) => tag.summary.length === 0).map((tag) => tag.name)
        expect(withoutSummary).toEqual([])
    })

    it("gives every response a short summary plus a description", () => {
        for (const { path, method, operation } of operations()) {
            for (const [status, response] of Object.entries(operation.responses)) {
                if ("$ref" in response) {
                    continue
                }
                const label = `${method} ${path} ${status}`
                expect(`${label}: ${response.summary ?? "missing"}`).not.toContain("missing")
                expect(response.description.length).toBeGreaterThan(10)
            }
        }
    })

    it("distinguishes the two ask verbs", () => {
        const ask = openapiDocument.paths["/ask"]
        expect(ask?.get?.summary).not.toBe(ask?.post?.summary)
    })

    it("is a branded document for the canonical origin", () => {
        expect(openapiDocument.info.title).toContain("Kevin Kraemer")
        expect(openapiDocument.info.title).toContain("kevinkraemer.com")
        expect(openapiDocument.servers[0]?.url).toBe("https://www.kevinkraemer.com")
        expect(openapiDocument.externalDocs.url).toBe("https://www.kevinkraemer.com/developers")
    })

    it("gives every operation a globally unique operationId", () => {
        const ids = operations().map(({ operation }) => operation.operationId)
        expect(new Set(ids).size).toBe(ids.length)
        for (const id of ids) {
            expect(id).toMatch(/^(get|post)[A-Z]/)
        }
    })

    it("keeps operationIds safe for LLM function-calling tool names", () => {
        for (const id of operations().map(({ operation }) => operation.operationId)) {
            expect(id).toMatch(/^[A-Za-z_][A-Za-z0-9_]{0,63}$/)
        }
    })

    it("describes every operation with a registered tag", () => {
        const tagNames = new Set(openapiDocument.tags.map((tag) => tag.name))
        for (const { operation } of operations()) {
            expect(operation.summary.length).toBeGreaterThan(0)
            expect(operation.description.length).toBeGreaterThan(20)
            for (const tag of operation.tags) {
                expect(tagNames.has(tag)).toBe(true)
            }
        }
    })

    it("types every success response and inlines declared failures", () => {
        assertSuccessTyped()
        assertRateLimitedShape()
        assertNotFoundShape()
        expect(declared404Entries().length).toBeGreaterThan(0)
    })

    it("documents a typed 404 for every Pages operation", () => {
        const pages = operations().filter(({ operation }) => operation.tags.some((tag) => PAGE_TAGS.includes(tag)))
        expect(pages.length).toBeGreaterThanOrEqual(10)
        for (const { path, operation } of pages) {
            expect(operation.responses["404"], `${path} 404`).toBeDefined()
        }
    })

    it("documents ?mode=agent on the homepage with a oneOf JSON envelope", () => {
        const home = getOperation("/")
        const mode = (home.parameters ?? []).find((parameter) => !("$ref" in parameter) && parameter.name === "mode")
        expect(mode).toMatchObject({ in: "query", required: false, example: "agent" })
        const jsonSchema = inlineResponse(home.responses["200"], "/ 200").content?.["application/json"]?.schema
        expect(jsonSchema).toEqual({
            description: expect.stringContaining("?mode=agent"),
            oneOf: [{ $ref: "#/components/schemas/PageDescriptor" }, { $ref: "#/components/schemas/AgentView" }],
        })
    })

    it("serves application/json on the majority of operations", () => {
        const withJson = jsonEntries()
        expect(withJson.length / operations().length).toBeGreaterThan(0.6)
    })

    it("wraps text discovery files in a typed FileDescriptor envelope", () => {
        for (const path of ["/llms.txt", "/llms-full.txt", "/rss.xml", "/sitemap-index.xml", "/robots.txt"]) {
            const success = inlineResponse(getOperation(path).responses["200"], `${path} 200`)
            expect(success.content?.["application/json"]?.schema).toEqual({
                $ref: "#/components/schemas/FileDescriptor",
            })
        }
    })

    it("documents a typed 502 for every negotiated page", () => {
        const negotiated = negotiatedEntries()
        expect(negotiated.length).toBeGreaterThanOrEqual(8)
        for (const { path, operation } of negotiated) {
            const upstream = inlineResponse(operation.responses["502"], `${path} 502`)
            expect(upstream.description).toContain("UPSTREAM_ERROR")
            expect(upstream.content?.["application/problem+json"]?.schema).toEqual({
                $ref: "#/components/schemas/UpstreamProblem",
            })
            expect(upstream.content?.["application/json"]?.schema).toEqual({
                $ref: "#/components/schemas/UpstreamProblem",
            })
        }
    })

    it("documents Vary: Accept on page responses", () => {
        expect(pageOperations().length).toBeGreaterThanOrEqual(8)
        for (const { path, operation } of pageOperations()) {
            const success = inlineResponse(operation.responses["200"], `${path} 200`)
            const vary = success.headers?.Vary
            expect(vary?.description.toLowerCase()).toContain("accept")
            expect(vary?.schema).toEqual({ type: "string" })
        }
    })

    it("serves html, markdown, and json representations for pages", () => {
        for (const { path, operation } of pageOperations()) {
            const success = inlineResponse(operation.responses["200"], `${path} 200`)
            expect(Object.keys(success.content ?? {})).toEqual(
                expect.arrayContaining(["text/html", "text/markdown", "application/json"]),
            )
        }
    })

    it("references the PageDescriptor schema for page JSON", () => {
        for (const { operation } of pageOperations()) {
            expect(pageJsonCandidates(operation)).toContainEqual({ $ref: "#/components/schemas/PageDescriptor" })
        }
    })

    it("matches the RFC 9457 problem envelope the edge function returns", () => {
        expect(openapiDocument.components.schemas.Problem).toEqual(problemSchema)

        const notFound = required(openapiDocument.components.responses.NotFound, "NotFound response")
        expect(notFound.content?.["application/problem+json"]?.schema).toEqual({
            $ref: "#/components/schemas/NotFoundProblem",
        })
        expect(notFound.content?.["application/json"]?.schema).toEqual({
            $ref: "#/components/schemas/NotFoundProblem",
        })
        expect(notFound.content?.["text/markdown"]).toBeDefined()

        const rateLimited = required(openapiDocument.components.responses.RateLimited, "RateLimited response")
        expect(rateLimited.content?.["application/problem+json"]?.schema).toEqual({
            $ref: "#/components/schemas/RateLimitedProblem",
        })
        expect(rateLimited.content?.["application/json"]?.schema).toEqual({
            $ref: "#/components/schemas/RateLimitedProblem",
        })
        expect(rateLimited.headers?.["Retry-After"]).toBeDefined()

        const upstreamError = required(openapiDocument.components.responses.UpstreamError, "UpstreamError response")
        expect(upstreamError.content?.["application/problem+json"]?.schema).toEqual({
            $ref: "#/components/schemas/UpstreamProblem",
        })
        expect(upstreamError.content?.["application/json"]?.schema).toEqual({
            $ref: "#/components/schemas/UpstreamProblem",
        })
    })

    it("covers every machine-readable endpoint exposed to agents", () => {
        const paths = new Set(Object.keys(openapiDocument.paths))
        for (const endpoint of catalogEntries.filter((candidate) => candidate.type !== "text/html")) {
            expect(paths.has(endpoint.path)).toBe(true)
        }
    })

    it("types the log slug parameter", () => {
        const entry = getOperation("/logs/{slug}")
        expect(entry.parameters?.[0]).toMatchObject({
            name: "slug",
            in: "path",
            required: true,
        })
    })

    it("types the project case slug parameter", () => {
        const entry = getOperation("/projects/{slug}")
        expect(entry.parameters?.[0]).toMatchObject({
            name: "slug",
            in: "path",
            required: true,
        })
    })

    it("types every parameter with a description for function calling", () => {
        expect(parameterIssues()).toEqual([])
    })

    it("describes every schema property for function calling", () => {
        expect(schemaIssues()).toEqual([])
    })

    it("registers a PageDescriptor schema matching the edge function output", () => {
        expect(pageDescriptorSchema.properties?.["apiVersion"]).toBeDefined()
    })

    it("versions the interface and documents the stability policy", () => {
        expect(apiVersion).toMatch(/^\d+\.\d+\.\d+$/)
        expect(openapiDocument.info.version).toBe(apiVersion)
        expect(openapiDocument.info.description).toContain("additively only")
        expect(openapiDocument.info.description).toContain("Rate limits")
        expect(openapiDocument.info.description).toContain("API-Version")
        expect(openapiDocument.info.description).toContain("Sunset")
        expect(openapiDocument.info.description).toContain("Deprecation")
    })

    it("accepts a versioned API-Version header parameter on every operation", () => {
        expect(openapiDocument.components.parameters.ApiVersionHeader).toMatchObject({
            name: "API-Version",
            in: "header",
            required: false,
        })
        for (const { path, operation } of operations()) {
            const refs = (operation.parameters ?? []).filter((parameter) => "$ref" in parameter)
            expect(refs, `${path} header version`).toContainEqual({
                $ref: "#/components/parameters/ApiVersionHeader",
            })
        }
    })

    it("declares Sunset and Deprecation headers on every Pages success response", () => {
        const pages = operations().filter(({ operation }) => operation.tags.some((tag) => PAGE_TAGS.includes(tag)))
        expect(pages.length).toBeGreaterThanOrEqual(10)
        for (const { path, operation } of pages) {
            const success = inlineResponse(operation.responses["200"], `${path} 200`)
            expect(success.headers?.Deprecation?.description).toContain("deprecated")
            expect(success.headers?.Sunset?.description).toContain(`${DEPRECATION_SUNSET_DAYS} days`)
        }
    })

    it("declares the API-Version response header on every success response", () => {
        for (const { path, operation } of operations()) {
            const success = inlineResponse(operation.responses["200"], `${path} 200`)
            expect(success.headers?.["API-Version"]?.description).toContain("version")
        }
    })

    it("documents typed request bodies for POST operations", () => {
        const posts = operations().filter(({ method }) => method === "post")
        expect(posts.length).toBeGreaterThanOrEqual(2)
        for (const { path, operation } of posts) {
            const body = operation.requestBody
            expect(body?.description.length, `${path} request body`).toBeGreaterThan(20)
            expect(body?.required, `${path} request body`).toBe(true)
            const json = body?.content["application/json"]
            expect(json?.schema, `${path} json schema`).toBeDefined()
        }
    })

    it("registers the ask and MCP operations", () => {
        const ask = openapiDocument.paths["/ask"]
        const mcp = openapiDocument.paths["/mcp"]
        expect(askOperationIds(ask)).toEqual(["getAskAnswer", "postAskAnswer"])
        expect(mcpOperationIds(mcp)).toEqual([undefined, "postMcpMessage"])
        const tags = agentTags(ask, mcp)
        expect(tags[0]).toContain("Agents")
        expect(tags[1]).toContain("Agents")
        expect(tags[2]).toContain("Agents")
    })

    it("documents 405 with an Allow header wherever methods are restricted", () => {
        for (const [path, allow] of [
            ["/ask", "GET, POST, OPTIONS"],
            ["/mcp", "POST, OPTIONS"],
        ] as const) {
            const item = openapiDocument.paths[path]
            for (const operation of [item?.get, item?.post]) {
                if (operation === undefined) {
                    continue
                }
                const response = operation.responses["405"]
                expect(response, `${path} ${operation.operationId} 405`).toBeDefined()
                if (response === undefined || "$ref" in response) {
                    continue
                }
                expect(response.description).toContain(allow)
                expect(response.headers?.Allow).toBeDefined()
            }
        }
    })
})
