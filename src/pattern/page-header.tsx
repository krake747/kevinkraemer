import type { ComponentProps } from "@solidjs/web"
import { cx } from "@ui/cva.config"
import { omit } from "solid-js"

export function PageHeader(props: ComponentProps<"header">) {
    const rest = omit(props, "class", "children")
    return (
        <header {...rest} class={cx(props.class)}>
            {props.children}
        </header>
    )
}

export function PageHeaderTitle(props: ComponentProps<"h1">) {
    const rest = omit(props, "class", "children")
    return (
        <h1
            {...rest}
            class={cx("text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100", props.class)}
        >
            {props.children}
        </h1>
    )
}

export function PageHeaderMeta(props: ComponentProps<"div">) {
    const rest = omit(props, "class", "children")
    return (
        <div {...rest} class={cx("mt-4", props.class)}>
            {props.children}
        </div>
    )
}
