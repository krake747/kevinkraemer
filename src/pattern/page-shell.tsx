import { PageFrame } from "@pattern/page-frame"
import { cx } from "@ui/cva.config"
import type { ParentProps } from "solid-js"

export function PageShell(props: ParentProps<{ class?: string }>) {
    return (
        <div class="flex-1">
            <PageFrame class={cx("mx-auto max-w-6xl", props.class)}>{props.children}</PageFrame>
        </div>
    )
}
