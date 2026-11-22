#!/usr/bin/env node

import { appendFileSync, existsSync, readFileSync } from "node:fs"
import { relative } from "node:path"

const SUMMARY_PATH = "coverage/coverage-summary.json"
const METRICS = ["lines", "statements", "functions", "branches"]
const LOWEST_LIMIT = 10

if (!existsSync(SUMMARY_PATH)) {
    console.error(`coverage summary missing: ${SUMMARY_PATH}`)
    process.exit(1)
}

const summary = JSON.parse(readFileSync(SUMMARY_PATH, "utf8"))
const files = Object.entries(summary)
    .filter(([file]) => file !== "total")
    .map(([file, metrics]) => ({ file: relative(process.cwd(), file), metrics }))
    .sort((a, b) => a.metrics.lines.pct - b.metrics.lines.pct)
const rows = files.slice(0, LOWEST_LIMIT)

function percent(value) {
    return `${value.toFixed(2)}%`
}

function label(metric) {
    return metric[0].toUpperCase() + metric.slice(1)
}

const table = [
    `| Scope | ${METRICS.map(label).join(" | ")} |`,
    `| --- | ${METRICS.map(() => "---:").join(" | ")} |`,
    `| All | ${METRICS.map((metric) => percent(summary.total[metric].pct)).join(" | ")} |`,
    ...rows.map(
        ({ file, metrics }) => `| \`${file}\` | ${METRICS.map((metric) => percent(metrics[metric].pct)).join(" | ")} |`,
    ),
]

const markdown = [
    "## Coverage",
    "",
    table.join("\n"),
    "",
    `Showing the ${rows.length} lowest-covered files of ${files.length}.`,
    "",
].join("\n")

const target = process.env.GITHUB_STEP_SUMMARY

if (target) {
    appendFileSync(target, markdown)
} else {
    process.stdout.write(markdown)
}
