import { siteContent } from "@core/content/site-content"
import { ProjectList } from "@features/project/list"
import { DocumentPage } from "@pattern/document-page"
import { PageHeader, PageHeaderTitle } from "@pattern/page-header"
import { Seo } from "@pattern/seo"
import { TerminalCommandHeader } from "@ui/terminal-command-header"

export default function ProjectsRoute() {
    return (
        <DocumentPage>
            <PageHeader class="animate-rise">
                <TerminalCommandHeader command="ls ~/projects" class="mb-4" />
                <PageHeaderTitle>Projects</PageHeaderTitle>
            </PageHeader>
            <Seo title="Projects" description="Case files for selected projects." path="/projects" />
            <ProjectList projects={siteContent.projects} />
        </DocumentPage>
    )
}
