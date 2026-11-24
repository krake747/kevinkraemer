import { findById } from "@core/content/model"
import { siteContent } from "@core/content/site-content"
import { ProjectEntry } from "@features/project/entry"
import { ProjectNotFound } from "@features/project/not-found"
import { sectionTrail, DetailPage } from "@pattern/detail-page"
import { BreadcrumbSchema } from "@pattern/seo"
import { type RouteProps } from "@solidjs/router"
import { defineFileRoute } from "@solidjs/router/fs"
import { Show } from "solid-js"

export const route = defineFileRoute("/projects/:slug")

export default function ProjectRoute(props: RouteProps<typeof route>) {
    const project = () => findById(siteContent.projects, props.params.slug)

    return (
        <Show when={project()} fallback={<ProjectNotFound />}>
            {(entry) => (
                <DetailPage
                    seo={{
                        title: `${entry().name} · Projects`,
                        description: entry().tagline,
                        path: `/projects/${entry().id}`,
                    }}
                >
                    <BreadcrumbSchema items={sectionTrail("Projects", "/projects", entry().name)} />
                    <ProjectEntry project={entry()} />
                </DetailPage>
            )}
        </Show>
    )
}
