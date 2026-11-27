import type { LogEntry, Project } from "@core/content/model"

const PRERENDER_STATIC_PATHS = [
    "/",
    "/about",
    "/cv",
    "/uses",
    "/contact",
    "/privacy",
    "/developers",
    "/projects",
    "/logs",
    "/search",
    "/scalar",
    "/ama",
] as const

type PathContent = {
    logs: Pick<LogEntry, "id">[]
    projects: Pick<Project, "id">[]
}

export function prerenderPaths(content: PathContent): string[] {
    return [
        ...PRERENDER_STATIC_PATHS,
        ...content.logs.map((entry) => `/logs/${entry.id}`),
        ...content.projects.map((project) => `/projects/${project.id}`),
    ]
}

export function sitemapPaths(content: PathContent): string[] {
    return prerenderPaths(content)
        .filter((path) => path !== "/search")
        .toSorted()
}
