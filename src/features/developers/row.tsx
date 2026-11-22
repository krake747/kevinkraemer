import type { JSX } from "@solidjs/web"
import { StackRow } from "@ui/stack-row"

export function DevelopersRow(props: { children?: JSX.Element }) {
    return (
        <StackRow as="li" class="grid gap-1 sm:grid-cols-[minmax(0,12rem)_1fr] sm:gap-4">
            {props.children}
        </StackRow>
    )
}
