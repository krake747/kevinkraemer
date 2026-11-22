import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

import { apiVersion } from "@core/site/api-version"
import { catalogEntries } from "@core/site/catalog"
import { endpoints } from "@core/site/endpoints"
import { buildHeaders, buildLinkset, buildSkillsIndex } from "@core/site/site-files"
import { origin } from "@core/site/urls"
import { describe, expect, it } from "vite-plus/test"

const skillsRoot = "public/.well-known/agent-skills"

function authoredSkills() {
    return readdirSync(skillsRoot, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => ({
            name: entry.name,
            markdown: readFileSync(join(skillsRoot, entry.name, "SKILL.md"), "utf8"),
        }))
}

describe("generated site files", () => {
    it("keeps _headers in sync with the endpoint registry", () => {
        expect(readFileSync("public/_headers", "utf8")).toBe(buildHeaders(endpoints, apiVersion))
    })

    it("keeps the linkset in sync with the catalog", () => {
        const linkset = JSON.parse(readFileSync("public/.well-known/api-catalog", "utf8"))
        expect(linkset).toEqual(buildLinkset(catalogEntries, origin))
    })

    it("keeps the agent skills index in sync with the skill files", async () => {
        const index = JSON.parse(readFileSync(join(skillsRoot, "index.json"), "utf8"))
        await expect(buildSkillsIndex(authoredSkills())).resolves.toEqual(index)
    })
})

describe("agent skills index", () => {
    it("digests the bytes it points at", async () => {
        const index = await buildSkillsIndex([
            { name: "kevinkraemer-com", markdown: "---\nname: kevinkraemer-com\ndescription: A site.\n---\n" },
        ])

        expect(index.skills[0]?.digest).toMatch(/^sha256:[0-9a-f]{64}$/)
        expect(index.skills[0]?.url).toBe("/.well-known/agent-skills/kevinkraemer-com/SKILL.md")
    })

    it("rejects a skill whose name does not match its directory", async () => {
        await expect(
            buildSkillsIndex([
                { name: "other-name", markdown: "---\nname: kevinkraemer-com\ndescription: A site.\n---\n" },
            ]),
        ).rejects.toThrow("Skill other-name needs a name that matches its directory")
    })

    it("rejects a skill without a description", async () => {
        await expect(
            buildSkillsIndex([
                { name: "kevinkraemer-com", markdown: "---\nname: kevinkraemer-com\ndescription: ''\n---\n" },
            ]),
        ).rejects.toThrow("Skill kevinkraemer-com needs a description")
    })
})
