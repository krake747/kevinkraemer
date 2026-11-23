import { StackRow } from "@ui/stack-row"
import type { ParentProps } from "solid-js"

export function ProjectMetadataRow(props: ParentProps<{ label: string }>) {
    return (
        <StackRow class="grid gap-1 sm:grid-cols-[minmax(0,10rem)_1fr] sm:items-baseline sm:gap-4">
            <dt class="font-mono text-xs tracking-widest text-stone-600 uppercase dark:text-stone-400">
                {props.label}
            </dt>
            {props.children}
        </StackRow>
    )
}
