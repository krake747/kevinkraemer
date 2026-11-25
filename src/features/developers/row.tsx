import { StackRow } from "@pattern/stack"
import type { ParentProps } from "solid-js"

export function DevelopersRow(props: ParentProps) {
    return (
        <StackRow
            render={(renderProps) => <li {...renderProps} />}
            class="grid gap-1 sm:grid-cols-[minmax(0,12rem)_1fr] sm:gap-4"
        >
            {props.children}
        </StackRow>
    )
}
