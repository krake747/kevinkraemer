import type { ComponentProps } from "@solidjs/web"
import { cx } from "@ui/cva.config"
import { omit } from "solid-js"

export function PanelLabel(props: ComponentProps<"div">) {
    const rest = omit(props, "class", "children")
    return (
        <div
            {...rest}
            class={cx(
                "mb-3 flex items-center gap-1.5 font-mono text-xs tracking-widest text-stone-600 uppercase dark:text-stone-400",
                props.class,
            )}
        >
            {props.children}
        </div>
    )
}
