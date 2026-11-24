import { execSync } from "node:child_process"
import { existsSync, readFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"

const root = new URL("../..", import.meta.url).pathname

const IGNORED_PREFIXES = [".agents/", ".opencode/"]
const IGNORED_PATHS = ["src/generated"]
const PATH_PATTERN = /`((?:src|docs|scripts|netlify|e2e)\/[A-Za-z0-9_./-]+?)`/g
const LINK_PATTERN = /\]\(([^)\s]+)\)/g

const failures = []

function tracked(pattern) {
    return execSync(`git ls-files '${pattern}'`, { cwd: root, encoding: "utf8" }).trim().split("\n").filter(Boolean)
}

function blob(file) {
    return readFileSync(join(root, file), "utf8")
}

function blankFences(text) {
    return text
        .replace(/```[\s\S]*?```/g, (block) => block.replace(/[^\n]/g, ""))
        .replace(/~~~[\s\S]*?~~~/g, (block) => block.replace(/[^\n]/g, ""))
}

function markdownFiles() {
    return tracked("*.md").filter((file) => !IGNORED_PREFIXES.some((prefix) => file.startsWith(prefix)))
}

function checkProjectPaths(file, text) {
    for (const match of text.matchAll(PATH_PATTERN)) {
        const candidate = match[1].replace(/\/$/, "")
        if (IGNORED_PATHS.some((prefix) => candidate === prefix || candidate.startsWith(`${prefix}/`))) {
            continue
        }
        if (!existsSync(join(root, candidate))) {
            failures.push(`dead path: ${candidate} (in ${file})`)
        }
    }
}

function checkRelativeLinks(file, text) {
    for (const match of text.matchAll(LINK_PATTERN)) {
        const target = match[1]
        if (/^(?:[a-z][a-z0-9+.-]*:|\/|#)/i.test(target)) {
            continue
        }
        const path = target.split(/[?#]/)[0]
        if (path === "" || !existsSync(resolve(root, dirname(file), path))) {
            failures.push(`broken link: ${target} (in ${file})`)
        }
    }
}

function checkCommands() {
    const scripts = new Set(Object.keys(JSON.parse(blob("package.json")).scripts))
    for (const line of blob("CONTRIBUTING.md").split("\n")) {
        if (!line.startsWith("|")) {
            continue
        }
        for (const match of line.matchAll(/`pnpm ([a-z][a-z0-9:-]*)`/g)) {
            if (!scripts.has(match[1])) {
                failures.push(`unknown script: pnpm ${match[1]} (in CONTRIBUTING.md)`)
            }
        }
    }
}

function checkAdrShape(file, text) {
    if (!/^docs\/adr\/[0-9]/.test(file)) {
        return
    }
    const lines = blob(file).split("\n").length
    if (lines > 40) {
        failures.push(`adr over 40 lines: ${lines} (in ${file})`)
    }
    if (!/^Date: /m.test(text)) {
        failures.push(`adr missing Date: (in ${file})`)
    }
    if (!/^## Status/m.test(text)) {
        failures.push(`adr missing Status: (in ${file})`)
    }
}

function checkSourceOfTruth(file, text) {
    if (!/^(docs\/(agents|design)\/.*\.md|docs\/(discovery|runtime)\.md)$/.test(file)) {
        return
    }
    if (!/source of truth/i.test(text)) {
        failures.push(`doc missing Source of truth: (in ${file})`)
    }
}

for (const file of markdownFiles()) {
    const text = blankFences(blob(file))
    checkProjectPaths(file, text)
    checkRelativeLinks(file, text)
    checkAdrShape(file, text)
    checkSourceOfTruth(file, text)
}
checkCommands()

if (failures.length > 0) {
    for (const failure of failures) {
        console.error(failure)
    }
    console.error(`\n${failures.length} docs check failure(s): fix the docs or the code they describe.`)
    process.exit(1)
}

console.log("docs check passed")
