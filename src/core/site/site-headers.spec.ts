import { readFileSync } from "node:fs"

import { apiVersion } from "@core/site/api-version"
import { describe, expect, it } from "vite-plus/test"

const headers = readFileSync("public/_headers", "utf8")

describe("public/_headers versioning", () => {
    it("declares the same API-Version on every machine-readable path", () => {
        const versions = [...headers.matchAll(/API-Version:\s*(\S+)/g)].map((match) => match[1])
        expect(versions.length).toBeGreaterThan(0)
        for (const version of versions) {
            expect(version).toBe(apiVersion)
        }
    })

    it("covers the discovery files graders probe", () => {
        for (const path of ["/openapi.json", "/llms.txt", "/rss.xml", "/sitemap-index.xml", "/robots.txt"]) {
            expect(headers).toContain(path)
        }
    })
})
