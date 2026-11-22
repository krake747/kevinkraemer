import type { ComponentProps } from "@solidjs/web"
import { cx } from "@ui/cva.config"
import { omit } from "solid-js"

export function Kbd(props: ComponentProps<"kbd">) {
    const rest = omit(props, "class", "children")
    return (
        <kbd {...rest} class={cx("border border-stone-300 px-1.5 py-0.5 dark:border-stone-700", props.class)}>
            {props.children}
        </kbd>
    )
}
