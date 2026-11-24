import { ViewportFrame } from "@pattern/viewport-frame"
import { cx } from "@ui/cva.config"
import type { ParentProps } from "solid-js"

export function PageColumn(props: ParentProps<{ class?: string }>) {
    return (
        <div class="flex-1">
            <ViewportFrame class={cx("mx-auto max-w-6xl", props.class)}>{props.children}</ViewportFrame>
        </div>
    )
}
