import { readFileSync } from "node:fs"
import { resolve } from "node:path"

import { apiVersion } from "@core/site/api-version"
import { canonicalFor } from "@core/site/urls"
import { SUPPORTED_PROTOCOL_VERSIONS } from "@modelcontextprotocol/server"
import * as v from "valibot"
import { describe, expect, it } from "vite-plus/test"

const cardSchema = v.object({
    $schema: v.string(),
    name: v.pipe(v.string(), v.regex(/^[a-zA-Z0-9.-]+\/[a-zA-Z0-9._-]+$/)),
    title: v.pipe(v.string(), v.minLength(1)),
    description: v.pipe(v.string(), v.minLength(1), v.maxLength(100)),
    version: v.string(),
    websiteUrl: v.pipe(v.string(), v.url()),
    remotes: v.pipe(
        v.array(
            v.object({
                type: v.picklist(["streamable-http", "sse"]),
                url: v.pipe(v.string(), v.url()),
                supportedProtocolVersions: v.array(v.string()),
            }),
        ),
        v.minLength(1),
    ),
})

function readCard() {
    const raw = readFileSync(resolve(process.cwd(), "public", "mcp", "server-card"), "utf8")
    return v.parse(cardSchema, JSON.parse(raw))
}

describe("MCP server card", () => {
    it("declares the published schema and the version the server reports", () => {
        const card = readCard()
        expect(card.$schema).toBe("https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json")
        expect(card.version).toBe(apiVersion)
    })

    it("points at the streamable-HTTP endpoint with the protocol versions the server negotiates", () => {
        const [remote] = readCard().remotes
        expect(remote?.type).toBe("streamable-http")
        expect(remote?.url).toBe(canonicalFor("/mcp"))
        expect(remote?.supportedProtocolVersions).toEqual([...SUPPORTED_PROTOCOL_VERSIONS])
    })

    it("addresses the site it serves", () => {
        expect(readCard().websiteUrl).toBe(canonicalFor("/"))
    })

    it("matches the ARD entry that points at it", () => {
        const manifest = v.parse(
            v.object({ entries: v.array(v.object({ url: v.string(), description: v.string(), version: v.string() })) }),
            JSON.parse(readFileSync("public/.well-known/ard.json", "utf8")),
        )
        const entry = manifest.entries.find((candidate) => candidate.url === canonicalFor("/mcp/server-card"))
        expect(entry?.description).toBe(readCard().description)
        expect(entry?.version).toBe(readCard().version)
    })
})
