#!/usr/bin/env node

import { readFileSync, readdirSync, statSync, globSync } from "node:fs"

import { patterns, collectMatches } from "./cliche-patterns.mjs"

const DEFAULT_GLOB = "content/logs/**/*.md"
const FLAG_DISABLE = "--disable"
const FLAG_ENABLE = "--enable"
const FLAG_JSON = "--json"
const FLAG_HELP = "--help"

function help() {
    console.log(`cliche-lint — highlight LLM clichés in Logs

Usage:
  node scripts/prose/cliche-lint.mjs [files...] [flags]
  node scripts/prose/cliche-lint.mjs --disable colon-triple content/logs/**/*.md

Flags:
  --disable <id>   disable pattern (repeatable) e.g. --disable colon-triple
  --enable <id>    enable only this pattern (repeatable, inverts default)
  --json           JSON output { files: [{ file, matches: [{patternId,name,start,end,snippet}] }] }
  --help           this

Patterns (${patterns.length}):
  ${patterns.map((p) => p.id).join(", ")}

Examples:
  pnpm check:prose
  node scripts/prose/cliche-lint.mjs --disable colon-triple
  node scripts/prose/cliche-lint.mjs --json content/logs/2026-08-23-something-visible.md
`)
}

function parseArgs(argv) {
    const files = []
    const disables = new Set()
    const enables = new Set()
    let json = false
    for (let i = 2; i < argv.length; i++) {
        const a = argv[i]
        if (a === FLAG_HELP || a === "-h") {
            help()
            process.exit(0)
        } else if (a === FLAG_JSON) {
            json = true
        } else if (a === FLAG_DISABLE) {
            const id = argv[++i]
            if (!id) {
                console.error("missing id after --disable")
                process.exit(2)
            }
            disables.add(id)
        } else if (a === FLAG_ENABLE) {
            const id = argv[++i]
            if (!id) {
                console.error("missing id after --enable")
                process.exit(2)
            }
            enables.add(id)
        } else if (a.startsWith("-")) {
            console.error(`unknown flag ${a}`)
            process.exit(2)
        } else {
            files.push(a)
        }
    }
    return { files, disables, enables, json }
}

function expandGlobs(patterns_) {
    const out = []
    for (const pat of patterns_) {
        try {
            // @ts-ignore - globSync may not exist on older Node but we check
            if (typeof globSync === "function") {
                // eslint-disable-next-line no-undef
                const hits = globSync(pat)
                if (hits.length) {
                    out.push(...hits)
                    continue
                }
            }
        } catch {}

        try {
            const st = statSync(pat)
            if (st.isFile()) out.push(pat)
            else if (st.isDirectory()) out.push(pat)
        } catch {
            if (pat.includes("**")) {
                walk("content/logs", out)
            } else {
                out.push(pat)
            }
        }
    }
    return out
}

function walk(dir, out) {
    let entries
    try {
        entries = readdirSync(dir, { withFileTypes: true })
    } catch {
        return
    }
    for (const e of entries) {
        const p = `${dir}/${e.name}`
        if (e.isDirectory()) walk(p, out)
        else if (e.isFile() && p.endsWith(".md")) out.push(p)
    }
}

function snippet(text, start, end) {
    const s = text.slice(start, end).replace(/\s+/g, " ").trim()
    return s.length > 120 ? s.slice(0, 117) + "…" : s
}

function main() {
    const { files, disables, enables, json } = parseArgs(process.argv)
    const inputFiles = files.length ? expandGlobs(files) : expandGlobs([DEFAULT_GLOB])

    const uniq = [...new Set(inputFiles)].sort((a, b) => a.localeCompare(b))

    let enabled = new Set(patterns.map((p) => p.id))
    if (enables.size) {
        enabled = new Set([...enables].filter((id) => patterns.some((p) => p.id === id)))
        for (const id of enables) {
            if (!patterns.some((p) => p.id === id)) {
                console.error(`unknown pattern id: ${id}`)
                process.exit(2)
            }
        }
    }
    for (const id of disables) {
        if (!patterns.some((p) => p.id === id)) {
            console.error(`unknown pattern id: ${id} (available: ${patterns.map((p) => p.id).join(", ")})`)
            process.exit(2)
        }
        enabled.delete(id)
    }

    if (!uniq.length) {
        if (json) console.log(JSON.stringify({ files: [] }, null, 2))
        else console.log("No files matched. Checked 0 files.")
        process.exit(0)
    }

    const results = []
    let totalMatches = 0
    for (const file of uniq) {
        let raw
        try {
            raw = readFileSync(file, "utf8")
        } catch (e) {
            console.error(`skip ${file}: ${e.message}`)
            continue
        }
        let text = raw

        if (text.startsWith("---")) {
            const end = text.indexOf("\n---", 3)
            if (end !== -1) text = text.slice(end + 4)
        }

        text = text.replace(/```[\s\S]*?```/g, (m) => " ".repeat(m.length))
        text = text.replace(/~~~[\s\S]*?~~~/g, (m) => " ".repeat(m.length))

        text = text.replace(/`[^`]*`/g, (m) => " ".repeat(m.length))

        text = text.replace(/<!--[\s\S]*?-->/g, (m) => " ".repeat(m.length))

        text = text.replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
        const { matches } = collectMatches(text, enabled)
        totalMatches += matches.length
        const byId = new Map()
        for (const m of matches) byId.set(m.patternId, (byId.get(m.patternId) || 0) + 1)

        results.push({
            file,
            matches: matches.map((m) => {
                const pat = patterns.find((p) => p.id === m.patternId)
                return {
                    patternId: m.patternId,
                    name: pat.name,
                    start: m.start,
                    end: m.end,
                    snippet: snippet(text, m.start, m.end),
                    badge: m.badge ?? null,
                    badgeTitle: m.badgeTitle ?? null,
                }
            }),
            counts: Object.fromEntries(byId),
        })
    }

    if (json) {
        console.log(JSON.stringify({ files: results, totalMatches, enabled: [...enabled] }, null, 2))
    } else {
        for (const r of results) {
            if (!r.matches.length) continue
            console.log(`\n${r.file} — ${r.matches.length} match${r.matches.length === 1 ? "" : "es"}`)
            for (const m of r.matches) {
                const badge = m.badge ? ` [${m.badge}${m.badgeTitle ? ` ${m.badgeTitle}` : ""}]` : ""
                console.log(`  • ${m.patternId} — “${m.snippet}” — ${m.name}${badge}`)
            }
        }
        if (totalMatches === 0) {
            console.log(
                `✓ 0 clichés in ${uniq.length} file${uniq.length === 1 ? "" : "s"} (patterns: ${enabled.size}/${patterns.length})`,
            )
        } else {
            console.log(
                `\n${totalMatches} total match${totalMatches === 1 ? "" : "es"} in ${uniq.length} file${uniq.length === 1 ? "" : "s"} (patterns: ${enabled.size}/${patterns.length})`,
            )
            console.log(`Disable noisy patterns: node scripts/prose/cliche-lint.mjs --disable colon-triple`)
        }
    }
    process.exit(totalMatches ? 1 : 0)
}

main()
