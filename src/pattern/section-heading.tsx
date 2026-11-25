import type { ComponentProps } from "@solidjs/web"
import { cx } from "@ui/cva.config"
import { Hash } from "@ui/icon"
import { omit } from "solid-js"

export function SectionHeading(props: ComponentProps<"h2">) {
    const rest = omit(props, "class", "children")
    return (
        <h2
            {...rest}
            class={cx("mb-4 flex items-center gap-2 font-mono text-xs text-stone-600 dark:text-stone-300", props.class)}
        >
            <Hash class="size-3 text-emerald-800 dark:text-emerald-400" />
            <span>{props.children}</span>
        </h2>
    )
}
