import {
    CV_SECTIONS,
    HOME_SECTIONS,
    NAV_ENTRIES,
    isCvPath,
    isHomePath,
    isLogsPath,
    type NavEntry,
} from "@core/nav/paths"

type NavSectionLink = Pick<NavEntry, "label" | "href">

type ActiveKind = "home" | "cv" | "logs"

const ACTIVE_MATCH: Record<ActiveKind, (pathname: string) => boolean> = {
    home: isHomePath,
    cv: isCvPath,
    logs: isLogsPath,
}

const ACTIVE_LABEL_FALLBACK = { home: "~/portfolio", cv: "~/cv" } as const

const ACTIVE_SECTIONS = { home: HOME_SECTIONS, cv: CV_SECTIONS } as const

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
        case "logs": {
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
    for (const kind of ["cv", "home"] as const) {
        if (ACTIVE_MATCH[kind](pathname)) {
            return ACTIVE_SECTIONS[kind].map(({ label, href }) => ({ label, href }))
        }
    }
    return []
}
