import type { JSX } from "@solidjs/web"
import { cx } from "@ui/cva.config"
import { StackRow } from "@ui/stack-row"
import type { ParentProps } from "solid-js"

export function DisclosureRow(props: ParentProps<{ summary: JSX.Element; class?: string }>) {
    return (
        <StackRow as="details" size="compact" class={cx("group accordion lg:hidden", props.class)}>
            <summary class="-mx-4 -my-3 flex min-h-11 cursor-pointer list-none items-center px-4 font-mono text-xs text-stone-600 select-none dark:text-stone-400 [&::-webkit-details-marker]:hidden">
                {props.summary}
            </summary>
            <div class="mt-3">{props.children}</div>
        </StackRow>
    )
}
