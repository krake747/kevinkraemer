import type { ComponentProps } from "@solidjs/web"
import { cx } from "@ui/cva.config"
import { omit } from "solid-js"

export function ProseSection(props: ComponentProps<"section">) {
    const rest = omit(props, "class", "children")
    return (
        <section {...rest} class={cx("animate-fade-up", props.class)}>
            {props.children}
        </section>
    )
}

export function ProseSectionBody(props: ComponentProps<"div">) {
    const rest = omit(props, "class", "children")
    return (
        <div
            {...rest}
            class={cx(
                "max-w-prose flex flex-col gap-4 text-base/[1.8] text-stone-600 dark:text-stone-400",
                props.class,
            )}
        >
            {props.children}
        </div>
    )
}
