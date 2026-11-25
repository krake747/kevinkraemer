import { StackRow } from "@pattern/stack-row"
import type { ComponentProps } from "@solidjs/web"
import { cx } from "@ui/cva.config"
import { omit, type ParentProps } from "solid-js"

export function DisclosureRow(props: ParentProps<{ class?: string }>) {
    const rest = omit(props, "class", "children")
    return (
        <StackRow
            {...rest}
            render={(renderProps) => <details {...renderProps} />}
            size="compact"
            class={cx("group accordion lg:hidden", props.class)}
        >
            {props.children}
        </StackRow>
    )
}

export function DisclosureRowSummary(props: ComponentProps<"summary">) {
    const rest = omit(props, "class", "children")
    return (
        <summary
            {...rest}
            class={cx(
                "-mx-4 -my-3 flex min-h-11 cursor-pointer list-none items-center px-4 font-mono text-xs text-stone-600 select-none dark:text-stone-400 [&::-webkit-details-marker]:hidden",
                props.class,
            )}
        >
            {props.children}
        </summary>
    )
}

export function DisclosureRowBody(props: ParentProps<{ class?: string }>) {
    const rest = omit(props, "class", "children")
    return (
        <div {...rest} class={cx("mt-3", props.class)}>
            {props.children}
        </div>
    )
}
