import type { NonEmpty } from "@core/non-empty"

export function isHomePath(pathname: string): boolean {
    return pathname === "/" || pathname === ""
}

function isSectionPath(pathname: string, section: string): boolean {
    return (
        pathname === section ||
        pathname === `${section}/` ||
        pathname.startsWith(`${section}/`) ||
        pathname.startsWith(`${section}#`) ||
        pathname.startsWith(`${section}?`)
    )
}

export function isCvPath(pathname: string): boolean {
    return isSectionPath(pathname, "/cv")
}

export function isLogsPath(pathname: string): boolean {
    return isSectionPath(pathname, "/logs")
}

function isUsesPath(pathname: string): boolean {
    return isSectionPath(pathname, "/uses")
}

export type NavEntry = {
    label: string
    href: string
    keywords: string[]
    topNav?: boolean
    active?: "home" | "cv" | "logs" | "uses" | "exact"
}

export const NAV_ENTRIES: NavEntry[] = [
    { label: "~/portfolio", href: "/", keywords: ["home", "start"], topNav: true, active: "home" },
    { label: "~/cv", href: "/cv", keywords: ["cv", "resume", "experience"], topNav: true, active: "cv" },
    { label: "~/logs", href: "/logs", keywords: ["logs", "entries", "writing"], topNav: true, active: "logs" },
    { label: "~/search", href: "/search", keywords: ["search", "find", "grep"], active: "exact" },
    { label: "~/about", href: "/about", keywords: ["bio", "story", "who"], active: "exact" },
    { label: "~/contact", href: "/contact", keywords: ["email", "reach", "touch"], active: "exact" },
    { label: "~/privacy", href: "/privacy", keywords: ["privacy", "data", "tracking", "cookies"], active: "exact" },
    {
        label: "~/developers",
        href: "/developers",
        keywords: ["api", "docs", "agents", "openapi", "machine", "llm"],
        active: "exact",
    },
    { label: "~/uses", href: "/uses", keywords: ["uses", "stack", "tools", "setup", "gear"], active: "uses" },
    {
        label: "~/projects",
        href: "/projects",
        keywords: ["projects", "work", "case", "cases", "portfolio"],
        active: "exact",
    },
]

export const TOP_NAV: NavEntry[] = NAV_ENTRIES.filter((entry) => entry.topNav)

type ActiveKind = "home" | "cv" | "logs" | "uses"

const ACTIVE_MATCH: Record<ActiveKind, (pathname: string) => boolean> = {
    home: isHomePath,
    cv: isCvPath,
    logs: isLogsPath,
    uses: isUsesPath,
}

const ACTIVE_LABEL_FALLBACK = { home: "~/portfolio", cv: "~/cv" } as const

type LabelKind = keyof typeof ACTIVE_LABEL_FALLBACK

const LABEL_KINDS = ["home", "cv"] as const satisfies readonly LabelKind[]

export function getCurrentPageLabel(pathname: string): string {
    for (const kind of LABEL_KINDS) {
        if (ACTIVE_MATCH[kind](pathname)) {
            return NAV_ENTRIES.find((entry) => entry.active === kind)?.label ?? ACTIVE_LABEL_FALLBACK[kind]
        }
    }
    return "~/"
}

export function isActiveFor(entry: NavEntry, pathname: string): boolean {
    switch (entry.active) {
        case "home":
        case "cv":
        case "logs":
        case "uses": {
            return ACTIVE_MATCH[entry.active](pathname)
        }
        case "exact":
        case undefined: {
            return pathname === entry.href || pathname === entry.href.replace(/\/$/, "")
        }
        default: {
            const exhaustive: never = entry.active
            return exhaustive
        }
    }
}

type SectionLink = {
    label: string
    href: string
}

declare module "@solidjs/router" {
    // oxlint-disable-next-line typescript/consistent-type-definitions
    interface RouteInfo {
        sections?: NonEmpty<SectionLink>
    }
}
