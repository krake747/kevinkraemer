import { readdir, readFile, writeFile } from "node:fs/promises"

import { apiVersion } from "@core/site/api-version"
import { catalogEntries } from "@core/site/catalog"
import { endpoints } from "@core/site/endpoints"
import { buildHeaders, buildLinkset, buildSkillsIndex, type SkillFile } from "@core/site/site-files"
import { origin } from "@core/site/urls"

const publicUrl = new URL("../public/", import.meta.url)
const skillsUrl = new URL(".well-known/agent-skills/", publicUrl)

async function readSkills(): Promise<SkillFile[]> {
    const entries = await readdir(skillsUrl, { withFileTypes: true })
    return Promise.all(
        entries
            .filter((entry) => entry.isDirectory())
            .map(async (entry) => {
                return {
                    name: entry.name,
                    markdown: await readFile(new URL(`${entry.name}/SKILL.md`, skillsUrl), "utf8"),
                }
            }),
    )
}

await writeFile(new URL("_headers", publicUrl), buildHeaders(endpoints, apiVersion))
await writeFile(
    new URL(".well-known/api-catalog", publicUrl),
    `${JSON.stringify(buildLinkset(catalogEntries, origin), null, 2)}\n`,
)
const skills = await buildSkillsIndex(await readSkills())
await writeFile(new URL("index.json", skillsUrl), `${JSON.stringify(skills, null, 4)}\n`)
console.log(`site files: ${endpoints.filter((endpoint) => endpoint.headers !== undefined).length} header blocks`)
