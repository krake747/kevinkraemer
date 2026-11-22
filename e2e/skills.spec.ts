import { createHash } from "node:crypto"

import { test, expect } from "@playwright/test"

type SkillEntry = {
    name: string
    type: string
    description: string
    url: string
    digest: string
}

test("the agent skills index points at a skill whose bytes match its digest", async ({ request }) => {
    const response = await request.get("/.well-known/agent-skills/index.json")
    expect(response.status()).toBe(200)
    expect(response.headers()["api-version"]).toBe("1.0.0")

    const index: { $schema: string; skills: SkillEntry[] } = await response.json()
    expect(index.$schema).toBe("https://schemas.agentskills.io/discovery/0.2.0/schema.json")
    expect(index.skills).toHaveLength(1)

    const skill = index.skills[0]
    if (skill === undefined) {
        throw new Error("the index listed no skill")
    }
    expect(skill.name).toBe("kevinkraemer-com")
    expect(skill.type).toBe("skill-md")
    expect(skill.url).toBe("/.well-known/agent-skills/kevinkraemer-com/SKILL.md")

    const served = await request.get(skill.url)
    expect(served.status()).toBe(200)
    const digest = createHash("sha256")
        .update(await served.text())
        .digest("hex")
    expect(skill.digest).toBe(`sha256:${digest}`)
})

test("the skill teaches retrieval paths that exist", async ({ request }) => {
    const skill = await (await request.get("/.well-known/agent-skills/kevinkraemer-com/SKILL.md")).text()

    for (const path of ["/llms.txt", "/logs-llms.txt", "/llms-full.txt", "/ask", "/mcp"]) {
        expect(skill).toContain(path)
    }
})
