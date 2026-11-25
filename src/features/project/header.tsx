import type { Project } from "@core/content/model"
import { PageHeader, PageHeaderTitle } from "@pattern/page-header"
import { TerminalCommandHeader } from "@pattern/terminal-command-header"
import type { VoidProps } from "solid-js"

export function ProjectHeader(props: VoidProps<{ project: Project }>) {
    return (
        <PageHeader class="mb-10">
            <TerminalCommandHeader command={`cat ${props.project.id}.md`} class="mb-4" />
            <PageHeaderTitle>{props.project.name}</PageHeaderTitle>
        </PageHeader>
    )
}
