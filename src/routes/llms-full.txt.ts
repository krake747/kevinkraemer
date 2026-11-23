import { sortByDateDesc, sortByOrder } from "@core/content/model"
import type { LogEntry, Project } from "@core/content/model"
import { siteContent } from "@core/content/site-content"
import { catalogEntries } from "@core/site/catalog"
import { text } from "@core/site/respond"
import { origin } from "@core/site/urls"

type CatalogPage = (typeof catalogEntries)[number]

function formatPageEntry(page: CatalogPage): string {
    return `- [${page.title}](${origin}${page.path}): ${page.description}`
}

function formatLogEntry(entry: LogEntry): string[] {
    const lines = [`## ${entry.title}`, "", `Date: ${entry.date}`, `URL: ${origin}/logs/${entry.id}`]
    if (entry.tags.length > 0) {
        lines.push(`Tags: ${entry.tags.join(", ")}`)
    }
    lines.push("", entry.description, "---", "", entry.body, "---", "")
    return lines
}

function yearLines(year: number | undefined): string[] {
    return year === undefined ? [] : [`Year: ${year}`]
}

function liveLines(liveUrl: string | undefined): string[] {
    return liveUrl === undefined ? [] : [`Live: ${liveUrl}`]
}

function repoLines(repoUrl: string | undefined): string[] {
    return repoUrl === undefined ? [] : [`Repo: ${repoUrl}`]
}

function decisionLines(decisions: Project["decisions"]): string[] {
    return decisions.length === 0
        ? []
        : ["", "### Key decisions", "", ...decisions.map((decision) => `- ${decision.title}: ${decision.reason}`)]
}

function evidenceLines(evidence: Project["evidence"]): string[] {
    return evidence.length === 0 ? [] : ["", "### Evidence", "", ...evidence.map((item) => `- ${item.caption}`)]
}

function changelogEntryLine(entry: Project["changelog"][number]): string {
    const href = entry.href ? ` (${entry.href})` : ""
    const note = entry.note ? `: ${entry.note}` : ""
    return `- ${entry.label}${href}${note}`
}

function changelogLines(changelog: Project["changelog"]): string[] {
    return changelog.length === 0 ? [] : ["", "### Changelog", "", ...changelog.map(changelogEntryLine)]
}

function projectHeader(project: Project): string[] {
    return [`## ${project.name}`, "", `URL: ${origin}/projects/${project.id}`, `Status: ${project.status}`]
}

function projectIntro(project: Project): string[] {
    return ["", project.tagline, "", "### Problem and point of view", "", project.problem]
}

function formatProjectEntry(project: Project): string[] {
    return [
        ...projectHeader(project),
        ...yearLines(project.year),
        `Stack: ${project.stack.join(", ")}`,
        `Role: ${project.role}`,
        ...liveLines(project.liveUrl),
        ...repoLines(project.repoUrl),
        ...projectIntro(project),
        ...decisionLines(project.decisions),
        ...evidenceLines(project.evidence),
        ...changelogLines(project.changelog),
        "---",
        "",
    ]
}

export function GET(): Response {
    const pages = catalogEntries.filter((entry) => entry.type === "text/html")

    return text(
        [
            "# Kevin Kraemer - Full Content Archive",
            "",
            `Site: ${origin}/`,
            "Author: Kevin Kraemer",
            "Description: Full-stack developer and former financial risk analyst based in Luxembourg",
            "",
            "---",
            "",
            "## Pages",
            "",
            ...pages.map(formatPageEntry),
            "",
            "---",
            "",
            "## Logs",
            "",
            ...sortByDateDesc(siteContent.logs).flatMap(formatLogEntry),
            "",
            "## Projects",
            "",
            ...sortByOrder(siteContent.projects).flatMap(formatProjectEntry),
        ].join("\n"),
    )
}
