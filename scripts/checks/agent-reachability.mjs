import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

export const retrievalAgents = ["ChatGPT-User", "ClaudeBot", "Claude-User", "PerplexityBot", "OAI-SearchBot"]

export function blockFor(robots, agent) {
    const pattern = new RegExp(`User-agent: ${agent}\\n((?:.+\\n)+?)(?=\\nUser-agent:|\\n#|$)`, "m")
    return pattern.exec(robots)?.[1] ?? ""
}

export function allowsAgent(robots, agent) {
    const block = blockFor(robots, agent)
    return block.length > 0 && block.includes("Allow: /") && !block.includes("Disallow")
}

export function checkRobots(robots) {
    return retrievalAgents.map((agent) => ({ agent, allowed: allowsAgent(robots, agent) }))
}

export async function probeAgent(target, agent, fetchImpl = fetch) {
    const response = await fetchImpl(target, { headers: { "User-Agent": `${agent}/1.0` } })
    return { agent, status: response.status, ok: response.status >= 200 && response.status < 400 }
}

const invokedDirectly = process.argv[1] !== undefined && fileURLToPath(import.meta.url) === process.argv[1]

if (invokedDirectly) {
    const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..")
    const robots = readFileSync(join(root, "public", "robots.txt"), "utf8")
    const rows = checkRobots(robots)
    let failed = false
    for (const row of rows) {
        console.log(`${row.agent}: ${row.allowed ? "allowed" : "BLOCKED"} in public/robots.txt`)
        if (!row.allowed) {
            failed = true
        }
    }
    const liveIndex = process.argv.indexOf("--live")
    const target = liveIndex >= 0 ? (process.argv[liveIndex + 1] ?? "https://www.kevinkraemer.com/") : null
    if (target !== null) {
        for (const agent of retrievalAgents) {
            try {
                const row = await probeAgent(target, agent)
                console.log(`${row.agent}: HTTP ${row.status} at ${target}`)
                if (!row.ok) {
                    failed = true
                }
            } catch (error) {
                console.log(`${agent}: probe failed at ${target}: ${error instanceof Error ? error.message : error}`)
                failed = true
            }
        }
    }
    if (failed) {
        process.exit(1)
    }
}
