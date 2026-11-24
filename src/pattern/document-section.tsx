import { ProseSection } from "@ui/prose-section"
import { SectionHeading } from "@ui/section-heading"
import type { ParentProps } from "solid-js"

type DocumentSectionProps = ParentProps<{
    id: string
    title: string
    sectionId?: string
    class?: string
}>

export function DocumentSection(props: DocumentSectionProps) {
    const sectionId = (): string | undefined => {
        if (props.sectionId) {
            return props.sectionId
        }
        return undefined
    }
    return (
        <ProseSection aria-labelledby={props.id} id={sectionId()} class={props.class}>
            <SectionHeading id={props.id}>{props.title}</SectionHeading>
            {props.children}
        </ProseSection>
    )
}
