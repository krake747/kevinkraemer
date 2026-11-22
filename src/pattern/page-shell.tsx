import { cx } from "@ui/cva.config"
import type { ParentProps } from "solid-js"

export const pageFrame = "px-4 pt-page-top pb-20 sm:px-6 md:px-12 lg:px-24"

export function PageShell(props: ParentProps<{ class?: string }>) {
    return (
        <main class="flex-1">
            <div class={cx("mx-auto max-w-6xl", pageFrame, props.class)}>{props.children}</div>
        </main>
    )
}
