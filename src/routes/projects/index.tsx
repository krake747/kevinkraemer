import { siteContent } from "@core/content/site-content"
import { ProjectList } from "@features/project/list"
import { DocumentPage, PageHeaderTitle } from "@pattern/page"
import { Seo } from "@pattern/seo"
import { TerminalCommandHeader } from "@pattern/terminal"

export default function ProjectsRoute() {
    return (
        <DocumentPage>
            <header class="animate-rise">
                <TerminalCommandHeader command="ls ~/projects" class="mb-4" />
                <PageHeaderTitle>Projects</PageHeaderTitle>
            </header>
            <Seo title="Projects" description="Case files for selected projects." path="/projects" />
            <ProjectList projects={siteContent.projects} />
        </DocumentPage>
    )
}
