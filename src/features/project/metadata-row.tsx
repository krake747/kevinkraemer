import { RecordRow } from "@pattern/record"
import type { ParentProps } from "solid-js"

export function ProjectMetadataRow(props: ParentProps<{ label: string }>) {
    return <RecordRow label={props.label}>{props.children}</RecordRow>
}
