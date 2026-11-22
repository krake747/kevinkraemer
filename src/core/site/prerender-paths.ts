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
] as const

type PathContent = {
    logs: { id: string }[]
    projects: { id: string }[]
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
