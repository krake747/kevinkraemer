import { cx } from "@ui/cva.config"
import type { ParentProps } from "solid-js"

export function PageColumn(props: ParentProps<{ class?: string }>) {
    return (
        <div class="flex-1">
            <div class={cx("mx-auto max-w-6xl px-4 pt-page-top pb-20 sm:px-6 md:px-12 lg:px-24", props.class)}>
                {props.children}
            </div>
        </div>
    )
}
