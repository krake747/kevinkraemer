import { execSync } from "node:child_process"

/*
 * Guardrail for proposal 2: patterns tsc cannot see.
 * - `as unknown as` is almost always a lie; use a precise type, a fixture, or an assertion.
 * - `Record<string, unknown>` is too weak for production shapes; use the JsonLd
 *   pattern or a named interface with precise value types.
 * - Other `as` casts (`) as T`, `} as T`) smuggle unchecked assumptions past the compiler;
 *   narrow, validate, or infer instead. `as const` stays allowed.
 */

const root = new URL("../..", import.meta.url).pathname

const patterns = ["as unknown as", "Record<string, unknown>"]

let failures = 0
for (const pattern of patterns) {
    try {
        const hits = execSync(`grep -rn --include='*.ts' --include='*.tsx' -F ${JSON.stringify(pattern)} src/`, {
            cwd: root,
            encoding: "utf-8",
        }).trim()
        if (hits.length > 0) {
            console.error(`forbidden pattern ${JSON.stringify(pattern)}:\n${hits}`)
            failures += 1
        }
    } catch {}
}

try {
    const casts = execSync(`grep -rn --include='*.ts' --include='*.tsx' -E '\\) as [A-Za-z]|} as [A-Za-z]' src/`, {
        cwd: root,
        encoding: "utf-8",
    })
        .trim()
        .split("\n")
        .filter((line) => line.length > 0 && !line.includes("as const"))
    if (casts.length > 0) {
        console.error(`forbidden \`as\` casts (narrow, validate, or infer instead):\n${casts.join("\n")}`)
        failures += 1
    }
} catch {}

if (failures > 0) {
    console.error("\nRemove the patterns above or extend this guard with a reason.")
    process.exit(1)
}
