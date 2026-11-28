import type { CatalogEntry } from "@core/site/catalog"
import type { Endpoint } from "@core/site/endpoints"
import * as v from "valibot"
import { parse as parseYaml } from "yaml"

export type SkillFile = {
    name: string
    markdown: string
}

const skillNamePattern = /^(?!.*--)[a-z0-9][a-z0-9-]{0,63}$/
const skillFrontmatter = /^---\r?\n([\s\S]*?)\r?\n---/
const skillOrder = new Intl.Collator("en")
const textEncoder = new TextEncoder()
const SKILL_DESCRIPTION_MAX_LENGTH = 1024

export async function buildSkillsIndex(skills: SkillFile[]) {
    const entries = await Promise.all(
        skills.map(async ({ name, markdown }) => {
            const attributes = skillAttributes(name, markdown)
            return {
                name,
                type: "skill-md" as const,
                description: attributes.description,
                url: `/.well-known/agent-skills/${name}/SKILL.md`,
                digest: `sha256:${await digest(markdown)}`,
            }
        }),
    )

    return {
        $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
        skills: entries.toSorted((a, b) => skillOrder.compare(a.name, b.name)),
    }
}

function skillAttributes(name: string, markdown: string): { name: string; description: string } {
    const attributes = skillFrontmatterAttributes(name, markdown)
    return {
        name: skillNameEntry({ directory: name, value: attributes.name }),
        description: skillDescriptionEntry({ name, value: attributes.description }),
    }
}

const SkillNameSchema = v.pipe(v.string(), v.regex(skillNamePattern))

const SkillDescriptionSchema = v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(SKILL_DESCRIPTION_MAX_LENGTH))

const SkillFrontmatterSchema = v.object({ name: v.unknown(), description: v.unknown() })

type SkillFrontmatter = v.InferOutput<typeof SkillFrontmatterSchema>

function skillFrontmatterAttributes(name: string, markdown: string): SkillFrontmatter {
    const match = skillFrontmatter.exec(markdown)
    if (match === null) {
        throw new Error(`Skill ${name} needs front matter`)
    }
    const parsed = v.safeParse(SkillFrontmatterSchema, parseYaml(match[1] ?? ""))
    if (!parsed.success) {
        throw new Error(`Skill ${name} needs front matter`)
    }
    return parsed.output
}

function skillNameEntry(input: { directory: string; value: unknown }): string {
    if (!v.is(SkillNameSchema, input.value)) {
        throw new Error(`Skill ${input.directory} needs a lowercase, hyphenated name`)
    }
    if (input.value !== input.directory) {
        throw new Error(`Skill ${input.directory} needs a name that matches its directory`)
    }
    return input.value
}

function skillDescriptionEntry(input: { name: string; value: unknown }): string {
    if (!v.is(SkillDescriptionSchema, input.value)) {
        if (typeof input.value !== "string" || input.value.trim().length === 0) {
            throw new Error(`Skill ${input.name} needs a description`)
        }
        throw new Error(`Skill ${input.name} needs a description of at most ${SKILL_DESCRIPTION_MAX_LENGTH} characters`)
    }
    return input.value
}

async function digest(markdown: string): Promise<string> {
    const bytes = textEncoder.encode(markdown)
    const hash = await crypto.subtle.digest("SHA-256", bytes)
    return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, "0")).join("")
}

const discoveryLinks = [
    '</.well-known/ard.json>; rel="ard"',
    '</llms.txt>; rel="describedby"',
    '</openapi.json>; rel="service-desc"',
    '</logs>; rel="archives"',
    '</sitemap-index.xml>; rel="sitemap"',
]

function headerBlock(endpoint: Endpoint, apiVersion: string): string {
    const lines = [endpoint.path]
    if (endpoint.headers?.contentType !== undefined) {
        lines.push(`  Content-Type: ${endpoint.headers.contentType}`)
    }
    lines.push(`  API-Version: ${apiVersion}`)
    return lines.join("\n")
}

const cacheBlocks = [
    ["/fonts/*", "public, max-age=31536000, immutable"],
    ["/assets/*", "public, max-age=31536000, immutable"],
] as const

export function buildHeaders(endpoints: Endpoint[], apiVersion: string): string {
    const headerBlocks = endpoints
        .filter((endpoint) => endpoint.headers !== undefined)
        .map((endpoint) => headerBlock(endpoint, apiVersion))
    const globalHeaders = ["/*", ...discoveryLinks.map((link) => `  Link: ${link}`)].join("\n")
    const cacheHeaders = cacheBlocks.map(([path, cacheControl]) => `${path}\n  Cache-Control: ${cacheControl}`)
    return [globalHeaders, ...headerBlocks, ...cacheHeaders].join("\n\n")
}

export function buildLinkset(entries: CatalogEntry[], origin: string) {
    return {
        linkset: [
            {
                anchor: `${origin}/`,
                item: entries.map((entry) => ({
                    href: `${origin}${entry.path}`,
                    rel: entry.rel,
                    type: entry.type,
                    title: entry.title,
                })),
            },
        ],
    }
}
