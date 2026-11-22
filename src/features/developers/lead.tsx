import type { ComponentProps } from "@solidjs/web"
import { cx } from "@ui/cva.config"
import { omit } from "solid-js"

export function DevelopersLead(props: ComponentProps<"span">) {
    const rest = omit(props, "class", "children")
    return (
        <span {...rest} class={cx("font-mono text-xs text-stone-900 dark:text-stone-200", props.class)}>
            {props.children}
        </span>
    )
}
