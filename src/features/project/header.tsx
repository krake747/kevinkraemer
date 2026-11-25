import type { Project } from "@core/content/model"
import { PageHeader } from "@pattern/page-header"
import type { VoidProps } from "solid-js"

export function ProjectHeader(props: VoidProps<{ project: Project }>) {
    return <PageHeader command={`cat ${props.project.id}.md`} title={props.project.name} class="mb-10" />
}
