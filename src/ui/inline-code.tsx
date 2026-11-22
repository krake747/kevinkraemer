import type { ComponentProps } from "@solidjs/web"
import { cx } from "@ui/cva.config"
import { omit } from "solid-js"

export function InlineCode(props: ComponentProps<"code">) {
    const rest = omit(props, "class", "children")
    return (
        <code
            {...rest}
            class={cx(
                "rounded bg-stone-100 px-1.5 py-0.5 font-mono text-sm text-emerald-700 dark:bg-stone-800 dark:text-emerald-400",
                props.class,
            )}
        >
            {props.children}
        </code>
    )
}
