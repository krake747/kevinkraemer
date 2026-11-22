import { siteContent } from "@core/content/site-content"
import { ProjectList } from "@features/project/list"
import { ProseShell } from "@pattern/prose-shell"
import { Seo } from "@pattern/seo"

export default function ProjectsRoute() {
    return (
        <ProseShell command="ls ~/projects" title="Projects">
            <Seo title="Projects" description="Case files for selected projects." path="/projects" />
            <ProjectList projects={siteContent.projects} />
        </ProseShell>
    )
}
