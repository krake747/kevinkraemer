import type { ComponentProps } from "@solidjs/web"
import { cx } from "@ui/cva.config"
import { omit, type VoidProps } from "solid-js"

export function DevelopersIndex(props: VoidProps<ComponentProps<"span"> & { index: number }>) {
    const rest = omit(props, "index", "class", "children")
    return (
        <span
            {...rest}
            aria-hidden="true"
            class={cx("font-mono text-xs text-stone-400 tabular-nums dark:text-stone-600", props.class)}
        >
            {String(props.index + 1).padStart(2, "0")}
        </span>
    )
}
