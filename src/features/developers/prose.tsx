import type { ComponentProps } from "@solidjs/web"
import { cx } from "@ui/cva.config"
import { omit } from "solid-js"

export function DevelopersProse(props: ComponentProps<"p">) {
    const rest = omit(props, "class", "children")
    return (
        <p {...rest} class={cx("max-w-prose text-sm/relaxed text-stone-700 dark:text-stone-300", props.class)}>
            {props.children}
        </p>
    )
}
