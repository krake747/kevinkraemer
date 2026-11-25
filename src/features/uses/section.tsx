import type { UsesSection as UsesSectionData } from "@core/content/model"
import { UsesGroup } from "@features/uses/group"
import { DocumentSection } from "@pattern/document-section"
import { SectionHeading } from "@pattern/section-heading"
import { For, type VoidProps } from "solid-js"

export function UsesSection(props: VoidProps<{ section: UsesSectionData }>) {
    const headingId = () => `uses-${props.section.id}-heading`

    return (
        <DocumentSection aria-labelledby={headingId()} id={props.section.id}>
            <SectionHeading id={headingId()}>{props.section.label}</SectionHeading>
            <div class="flex flex-col gap-8">
                <For each={props.section.groups}>{(group) => <UsesGroup group={group} />}</For>
            </div>
        </DocumentSection>
    )
}
