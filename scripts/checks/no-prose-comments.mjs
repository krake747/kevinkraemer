import { execSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..")
const baselinePath = join(root, "scripts", "checks", "no-prose-comments.baseline")

const SLASH2 = "/" + "/"
const BLOCK_OPEN = "/" + "*"
const HTML_OPEN = "<" + "!" + "--"
const STAR = "*"
const STAR_CLOSE = STAR + "/"

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
    const out = execSync("git ls-files '*.ts' '*.tsx' '*.mjs' '*.mts' '*.css'", {
        cwd: root,
        encoding: "utf8",
    }).trim()
    if (out === "") {
        return []
    }
    return out
        .split("\n")
        .filter(Boolean)
        .filter((file) => !file.startsWith("scripts/"))
}

function baseline() {
    try {
        return new Set(
            readFileSync(baselinePath, "utf8")
                .split("\n")
                .map((line) => line.trim())
                .filter((line) => line !== "" && line.startsWith("BASELINE ")),
        )
    } catch {
        return new Set()
    }
}

function isCommentStart(trimmed, isAstro) {
    if (trimmed.startsWith(SLASH2) || trimmed.startsWith(BLOCK_OPEN)) {
        return true
    }
    if (isAstro && trimmed.startsWith(HTML_OPEN)) {
        return true
    }
    if (trimmed.startsWith(STAR)) {
        const next = trimmed.slice(1, 2)
        if (next === " " || next === "" || trimmed === STAR_CLOSE || trimmed.startsWith(STAR + STAR)) {
            return true
        }
    }
    return false
}

function allowed(trimmed) {
    for (const token of ALLOW_TOKENS) {
        if (trimmed.includes(token)) {
            return true
        }
    }
    return false
}

const allowed_set = baseline()
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
        if (!isCommentStart(trimmed, file.endsWith(".astro"))) {
            continue
        }
        if (allowed(trimmed)) {
            continue
        }
        const key = "BASELINE " + file + "|" + trimmed
        if (allowed_set.has(key)) {
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
            " prose comment(s): move decisions to docs/adr, file issues for excuses, delete the rest.",
    )
    console.error("The baseline stays empty by design; fix the code instead.")
    process.exit(1)
}
