import { NAV_ENTRIES } from "@core/site/navigation"
import { site } from "@core/site/site-meta"
import { RSS_PATH } from "@core/site/urls"
import { BriefcaseBusiness, CodeXml, Download, Mail, Moon, Rss } from "@ui/icon"
import type { Component } from "solid-js"

export type CommandPaletteActionId = "toggle-theme" | "copy-email" | "download-cv"

type CommandPaletteIcon = Component<{ class?: string }>

type CommandPaletteCommandBase = {
    label: string
    group: "pages" | "actions"
    keywords?: string[]
    icon: CommandPaletteIcon | null
}

export type CommandPaletteCommand =
    | (CommandPaletteCommandBase & { kind: "route"; href: string })
    | (CommandPaletteCommandBase & { kind: "external"; href: string })
    | (CommandPaletteCommandBase & { kind: "action"; id: CommandPaletteActionId; flashLabel?: string })

const PAGE_COMMANDS: CommandPaletteCommand[] = NAV_ENTRIES.map((entry) => {
    return {
        kind: "route",
        group: "pages",
        label: entry.label,
        href: entry.href,
        keywords: entry.keywords,
        icon: null,
    }
})

const ACTION_COMMANDS = [
    {
        kind: "action",
        group: "actions",
        id: "toggle-theme",
        label: "toggle theme",
        keywords: ["theme", "dark", "light", "mode"],
        icon: Moon,
    },
    {
        kind: "action",
        group: "actions",
        id: "copy-email",
        label: "copy email",
        keywords: ["copy", "email", "mail", site.email],
        icon: Mail,
        flashLabel: "email copied",
    },
    {
        kind: "action",
        group: "actions",
        id: "download-cv",
        label: "download cv",
        keywords: ["download", "pdf"],
        icon: Download,
    },
] satisfies CommandPaletteCommand[]

const EXTERNAL_COMMANDS = [
    {
        kind: "external",
        group: "actions",
        label: "rss feed",
        href: RSS_PATH,
        keywords: ["rss", "feed", "subscribe", "logs", "blog", "xml"],
        icon: Rss,
    },
    {
        kind: "external",
        group: "actions",
        label: "github",
        href: site.socials.github,
        keywords: ["github", "code", "repo", "open source"],
        icon: CodeXml,
    },
    {
        kind: "external",
        group: "actions",
        label: "linkedin",
        href: site.socials.linkedin,
        keywords: ["linkedin", "career", "profile", "network", "work"],
        icon: BriefcaseBusiness,
    },
] satisfies CommandPaletteCommand[]

export function getCommandPaletteCommands(): CommandPaletteCommand[] {
    return [...PAGE_COMMANDS, ...ACTION_COMMANDS, ...EXTERNAL_COMMANDS]
}

type MatchScore = 0 | 1

function scoreCommand(command: CommandPaletteCommand, query: string): MatchScore | null {
    const haystack = [command.label, ...(command.keywords ?? [])].join(" ").toLowerCase()
    if (!haystack.includes(query)) {
        return null
    }
    return command.label.toLowerCase().startsWith(query) ? 0 : 1
}

export function matchCommandPaletteCommands(query: string, commands: CommandPaletteCommand[]): CommandPaletteCommand[] {
    const trimmed = query.trim().toLowerCase()
    if (trimmed === "") {
        return commands
    }
    return commands
        .map((command) => ({ command, score: scoreCommand(command, trimmed) }))
        .filter((entry) => entry.score !== null)
        .toSorted((a, b) => (a.score ?? 1) - (b.score ?? 1))
        .map((entry) => entry.command)
}
