import type { Project } from "@core/content/model"
import { DossierHead } from "@pattern/dossier-head"
import type { VoidProps } from "solid-js"

export function ProjectHeader(props: VoidProps<{ project: Project }>) {
    return (
        <DossierHead
            command={`cat ${props.project.id}.md`}
            title={props.project.name}
            lede={props.project.tagline}
            tone="mono"
            class="mb-10"
        />
    )
}
