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
                <p class="mt-4 max-w-prose text-base/relaxed text-stone-700 dark:text-stone-300">
                    The work, in one place. Each one gets the full story.
                </p>
            </header>
            <Seo title="Projects" description="Case files for selected projects." path="/projects" />
            <ProjectList projects={siteContent.projects} />
        </DocumentPage>
    )
}
