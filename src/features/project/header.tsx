import type { Project } from "@core/content/model"
import { PageHeaderTitle } from "@pattern/page"
import { TerminalCommandHeader } from "@pattern/terminal"
import type { VoidProps } from "solid-js"

export function ProjectHeader(props: VoidProps<{ project: Project }>) {
    return (
        <header class="mb-10 animate-rise">
            <TerminalCommandHeader command={`cat ${props.project.id}.md`} class="mb-4" />
            <PageHeaderTitle>{props.project.name}</PageHeaderTitle>
        </header>
    )
}
