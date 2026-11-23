export function isHomePath(pathname: string): boolean {
    return pathname === "/" || pathname === ""
}

export function isCvPath(pathname: string): boolean {
    return (
        pathname === "/cv" ||
        pathname === "/cv/" ||
        pathname.startsWith("/cv/") ||
        pathname.startsWith("/cv#") ||
        pathname.startsWith("/cv?")
    )
}

export function isLogsPath(pathname: string): boolean {
    return (
        pathname === "/logs" ||
        pathname === "/logs/" ||
        pathname.startsWith("/logs/") ||
        pathname.startsWith("/logs#") ||
        pathname.startsWith("/logs?")
    )
}

function isUsesPath(pathname: string): boolean {
    return (
        pathname === "/uses" ||
        pathname === "/uses/" ||
        pathname.startsWith("/uses/") ||
        pathname.startsWith("/uses#") ||
        pathname.startsWith("/uses?")
    )
}

export type NavEntry = {
    label: string
    href: string
    keywords?: string[]
    topNav?: boolean
    active?: "home" | "cv" | "logs" | "uses" | "exact"
}

export const NAV_ENTRIES: NavEntry[] = [
    { label: "~/portfolio", href: "/", keywords: ["home", "start"], topNav: true, active: "home" },
    { label: "~/cv", href: "/cv", keywords: ["cv", "resume", "experience"], topNav: true, active: "cv" },
    { label: "~/logs", href: "/logs", keywords: ["logs", "blog", "posts"], topNav: true, active: "logs" },
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

const HOME_SECTIONS: NavEntry[] = [
    { label: "#story", href: "/#story" },
    { label: "#logs", href: "/#logs" },
    { label: "#contact", href: "/#contact", keywords: ["contact", "email", "mail"] },
]

const CV_SECTIONS: NavEntry[] = [
    { label: "#experience", href: "/cv#experience" },
    { label: "#skills", href: "/cv#skills" },
    { label: "#projects", href: "/cv#projects" },
    { label: "#education", href: "/cv#education" },
]

const USES_SECTIONS: NavEntry[] = [
    { label: "#workspace", href: "/uses#workspace" },
    { label: "#development", href: "/uses#development" },
    { label: "#ai-agents", href: "/uses#ai-agents" },
    { label: "#exploring", href: "/uses#exploring" },
]

type NavSectionLink = Pick<NavEntry, "label" | "href">

type ActiveKind = "home" | "cv" | "logs" | "uses"

const ACTIVE_MATCH: Record<ActiveKind, (pathname: string) => boolean> = {
    home: isHomePath,
    cv: isCvPath,
    logs: isLogsPath,
    uses: isUsesPath,
}

const ACTIVE_LABEL_FALLBACK = { home: "~/portfolio", cv: "~/cv" } as const

const ACTIVE_SECTIONS = { home: HOME_SECTIONS, cv: CV_SECTIONS, uses: USES_SECTIONS } as const

export function getCurrentPageLabel(pathname: string): string {
    for (const kind of ["home", "cv"] as const) {
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

export function getSectionLinks(pathname: string): NavSectionLink[] {
    for (const kind of ["cv", "home", "uses"] as const) {
        if (ACTIVE_MATCH[kind](pathname)) {
            return ACTIVE_SECTIONS[kind].map(({ label, href }) => ({ label, href }))
        }
    }
    return []
}
