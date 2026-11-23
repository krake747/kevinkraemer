import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"

import { apiVersion } from "@core/site/api-version"
import { catalogEntries } from "@core/site/catalog"
import * as v from "valibot"
import { describe, expect, it } from "vite-plus/test"

function readPublic(relativePath: string): string {
    return readFileSync(path.resolve(process.cwd(), "public", relativePath), "utf8")
}

const DISCOVERABLE_FILES = [
    "/developers",
    "/llms-full.txt",
    "/openapi.json",
    "/rss.xml",
    "/sitemap-index.xml",
    "/.well-known/api-catalog",
    "/.well-known/ard.json",
    "/.well-known/agent-skills/index.json",
    "/mcp/server-card",
    "/logs-llms.txt",
]

describe("the agent guide", () => {
    const guide = readPublic("llms.txt")

    it("opens with the site name", () => {
        expect(guide).toMatch(/^# .+\n/)
    })

    it("says when the site applies", () => {
        const section = guide.split("## When To Use This Site")[1]?.split("##")[0] ?? ""
        expect(section.trim().length).toBeGreaterThan(50)
    })

    it("warns that the market presentation is a metaphor", () => {
        expect(guide.toLowerCase()).toContain("metaphor")
    })

    it.each(DISCOVERABLE_FILES)("links %s", (filePath) => {
        expect(guide).toContain(filePath)
    })

    it("links the trust anchor pages instead of home section anchors", () => {
        for (const filePath of ["/about", "/contact", "/privacy"]) {
            expect(guide).toContain(`https://www.kevinkraemer.com${filePath}`)
        }
        expect(guide).not.toContain("(https://www.kevinkraemer.com/#about)")
    })

    it("explains how to retrieve content", () => {
        expect(guide).toContain("## How To Retrieve Content")
        expect(guide.toLowerCase()).toContain("accept: text/markdown")
        expect(guide.toLowerCase()).toContain("curl")
    })

    it("documents versioning, deprecation, and the reserved namespaces", () => {
        expect(guide).toContain("API-Version")
        expect(guide).toContain("Sunset")
        expect(guide).toContain("Deprecation")
        expect(guide).toContain("?mode=agent")
        expect(guide).toContain("/api/*")
    })

    it("lists the Uses and Projects pages", () => {
        expect(guide).toContain("/uses")
        expect(guide).toContain("Uses")
        expect(guide).toContain("/projects")
        expect(guide).toContain("Projects")
    })
})

describe("the endpoint linkset", () => {
    const linksetSchema = v.object({
        linkset: v.optional(
            v.array(
                v.object({
                    item: v.optional(
                        v.array(
                            v.object({
                                href: v.optional(v.string()),
                                rel: v.optional(v.string()),
                                type: v.optional(v.string()),
                            }),
                        ),
                    ),
                }),
            ),
        ),
    })

    const readLinkset = () => v.parse(linksetSchema, JSON.parse(readPublic(".well-known/api-catalog")))

    it("is a valid RFC 9264 linkset covering every agent endpoint", () => {
        const linkset = readLinkset()
        const links = linkset.linkset?.[0]?.item ?? []
        expect(links.length).toBeGreaterThan(0)

        const hrefs = new Set(links.map((link) => link.href ?? "").filter((href) => href !== ""))
        for (const endpoint of catalogEntries) {
            expect(hrefs.has(`https://www.kevinkraemer.com${endpoint.path}`)).toBe(true)
        }

        const rels = new Set(links.map((link) => link.rel ?? ""))
        expect(rels).toContain("sitemap")
        expect(rels).toContain("service-doc")
        expect(rels).toContain("service-desc")

        const openapiLink = links.find((link) => link.href === "https://www.kevinkraemer.com/openapi.json")
        expect(openapiLink?.rel).toBe("service-desc")
        expect(openapiLink?.type).toBe("application/json")
    })

    it("gives every item a rel and a type", () => {
        const linkset = readLinkset()
        const links = linkset.linkset?.[0]?.item ?? []
        for (const link of links) {
            expect(typeof link.href).toBe("string")
            expect(typeof link.rel).toBe("string")
        }
    })
})

describe("the ARD manifest", () => {
    const ardEntrySchema = v.object({
        "@context": v.optional(v.string()),
        identifier: v.pipe(v.string(), v.regex(/^urn:air:[a-zA-Z0-9.-]+(?::[a-zA-Z0-9._-]+)+$/)),
        displayName: v.pipe(v.string(), v.minLength(1)),
        type: v.pipe(v.string(), v.regex(/^[a-zA-Z0-9!#$&^_.+-]+\/[a-zA-Z0-9!#$&^_.+-]+$/)),
        url: v.optional(v.pipe(v.string(), v.url())),
        representativeQueries: v.pipe(v.array(v.string()), v.minLength(2), v.maxLength(5)),
        description: v.optional(v.string()),
        capabilities: v.optional(v.array(v.string())),
        tags: v.optional(v.array(v.string())),
        version: v.optional(v.string()),
    })

    const readManifest = () =>
        v.parse(
            v.object({ entries: v.pipe(v.array(ardEntrySchema), v.minLength(1)) }),
            JSON.parse(readPublic(".well-known/ard.json")),
        )

    it("lists entries a registry can index", () => {
        for (const entry of readManifest().entries) {
            expect(entry.representativeQueries.length).toBeGreaterThanOrEqual(2)
            expect(entry.description?.length ?? 0).toBeGreaterThan(0)
        }
    })

    it("anchors every identifier to the serving domain", () => {
        for (const entry of readManifest().entries) {
            expect(entry.identifier.startsWith("urn:air:www.kevinkraemer.com:")).toBe(true)
        }
    })

    it("declares the ARD base context so generic JSON-LD tooling can expand it", () => {
        for (const entry of readManifest().entries) {
            expect(entry["@context"]).toBe("https://agenticresourcediscovery.org/context/v1")
        }
    })

    it("carries exactly one artifact source per entry", () => {
        const raw = v.parse(
            v.object({ entries: v.array(v.record(v.string(), v.unknown())) }),
            JSON.parse(readPublic(".well-known/ard.json")),
        )
        for (const entry of raw.entries) {
            expect("url" in entry !== "data" in entry).toBe(true)
        }
    })

    it("points every entry at a resource in the site catalog", () => {
        const urls = readManifest().entries.flatMap((entry) => (entry.url === undefined ? [] : [entry.url]))
        expect(urls.length).toBeGreaterThan(0)
        const catalogued = new Set<string>(catalogEntries.map((entry) => entry.path))
        for (const url of urls) {
            const parsed = new URL(url)
            expect(parsed.origin).toBe("https://www.kevinkraemer.com")
            expect(catalogued.has(parsed.pathname)).toBe(true)
        }
    })
})

describe("the logs guide", () => {
    it("scopes the writing for agents", () => {
        const guide = readPublic("logs-llms.txt")
        expect(guide.startsWith("# Logs")).toBe(true)
        expect(guide).toContain("https://www.kevinkraemer.com/logs")
        expect(guide).toContain("/llms-full.txt")
        expect(guide).not.toContain("market data")
    })
})

describe("the deployment", () => {
    it("keeps test files out of the Netlify edge-function entrypoint directory", () => {
        const edgeFunctionFiles = readdirSync(path.resolve(process.cwd(), "netlify/edge-functions"))
        const testFiles = edgeFunctionFiles.filter((file) => /\.(spec|test)\.ts$/.test(file))

        expect(testFiles).toEqual([])
    })

    it("has no SPA fallback masking real 404 responses", () => {
        let exists = true
        try {
            readFileSync(new URL("../../public/_redirects", import.meta.url), "utf8")
        } catch {
            exists = false
        }
        expect(exists).toBe(false)
    })

    it("serves the linkset as application/linkset+json", () => {
        const headers = readPublic("_headers")
        expect(headers).toContain("/.well-known/api-catalog")
        expect(headers).toContain("application/linkset+json")
    })

    it("versions the ARD manifest and the server card under the API contract", () => {
        const blocks = readPublic("_headers").split("\n\n")
        for (const filePath of ["/.well-known/ard.json", "/mcp/server-card"]) {
            const block = blocks.find((section) => section.startsWith(filePath))
            expect(block, `expected a _headers block for ${filePath}`).toContain(`API-Version: ${apiVersion}`)
        }
    })

    it("advertises the ARD manifest through a rel=ard Link header", () => {
        expect(readPublic("_headers")).toContain('</.well-known/ard.json>; rel="ard"')
    })

    it("advertises the OpenAPI spec through a service-desc Link header", () => {
        const headers = readPublic("_headers")
        expect(headers).toContain('</openapi.json>; rel="service-desc"')
    })
})
