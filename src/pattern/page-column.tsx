import { cx } from "@ui/cva.config"
import type { ParentProps } from "solid-js"

export function PageColumn(props: ParentProps<{ class?: string }>) {
    return (
        <div class={cx("flex-1 px-4 pt-page-top pb-24 sm:px-6 md:px-12 lg:px-24", props.class)}>
            <div class="mx-auto max-w-6xl">{props.children}</div>
        </div>
    )
}
