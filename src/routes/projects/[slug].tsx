import { findById } from "@core/content/model"
import { siteContent } from "@core/content/site-content"
import { ProjectArticle } from "@features/project/article"
import { ProjectNotFound } from "@features/project/not-found"
import { sectionTrail, DetailShell } from "@pattern/detail-shell"
import { useParams } from "@solidjs/router"
import { Show } from "solid-js"

export default function ProjectRoute() {
    const params = useParams()
    const project = () => findById(siteContent.projects, params.slug)

    return (
        <Show when={project()} fallback={<ProjectNotFound />}>
            {(entry) => (
                <DetailShell
                    seo={{
                        title: `${entry().name} · Projects`,
                        description: entry().tagline,
                        path: `/projects/${entry().id}`,
                        breadcrumbs: sectionTrail("Projects", "/projects", entry().name),
                    }}
                >
                    <ProjectArticle project={entry()} />
                </DetailShell>
            )}
        </Show>
    )
}
