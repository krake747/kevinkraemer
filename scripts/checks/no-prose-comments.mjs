import { execSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..")

const BLOCK_OPEN = "/" + "*"
const STAR = "*"

const ALLOW_TOKENS = [
    "oxlint-disable",
    "eslint-disable",
    "fallow-ignore",
    "@ts-",
    "@vite-ignore",
    "@param",
    "@returns",
    "reference",
    "See ADR-",
]

function tracked() {
    const out = execSync("git ls-files '*.css'", { cwd: root, encoding: "utf8" }).trim()
    if (out === "") {
        return []
    }
    return out
        .split("\n")
        .filter(Boolean)
        .filter((file) => !file.startsWith("scripts/"))
}

function isCommentStart(trimmed) {
    if (trimmed.startsWith(BLOCK_OPEN)) {
        return true
    }
    if (trimmed.startsWith(STAR)) {
        const next = trimmed.slice(1, 2)
        if (next === " " || next === "" || trimmed === STAR + "/" || trimmed.startsWith(STAR + STAR)) {
            return true
        }
    }
    return false
}

const failures = []

for (const file of tracked()) {
    let text
    try {
        text = readFileSync(join(root, file), "utf8")
    } catch {
        continue
    }
    const lines = text.split("\n")
    for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim()
        if (trimmed === "") {
            continue
        }
        if (!isCommentStart(trimmed)) {
            continue
        }
        if (ALLOW_TOKENS.some((token) => trimmed.includes(token))) {
            continue
        }
        failures.push(file + ":" + String(i + 1) + ": " + trimmed.slice(0, 120))
    }
}

if (failures.length > 0) {
    for (const failure of failures) {
        console.error(failure)
    }
    console.error("")
    console.error(
        String(failures.length) +
            " prose comment(s) in CSS: move decisions to docs/adr, file issues for excuses, delete the rest.",
    )
    process.exit(1)
}

console.log("comments check passed")
