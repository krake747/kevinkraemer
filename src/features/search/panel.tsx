import type { ComponentProps } from "@solidjs/web"
import { cx } from "@ui/cva.config"
import { omit } from "solid-js"

export function SearchPanelNote(props: ComponentProps<"p">) {
    const rest = omit(props, "class", "children")
    return (
        <p {...rest} class={cx("font-mono text-xs text-stone-600 dark:text-stone-400", props.class)}>
            {props.children}
        </p>
    )
}

export function SearchPanelEmphasis(props: ComponentProps<"span">) {
    const rest = omit(props, "class", "children")
    return (
        <span {...rest} class={cx("text-stone-900 dark:text-stone-100", props.class)}>
            {props.children}
        </span>
    )
}
