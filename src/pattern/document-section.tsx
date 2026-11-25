import { type ComponentProps, type JSX } from "@solidjs/web"
import { cx } from "@ui/cva.config"
import type { RenderProps } from "@ui/render"
import { merge, omit } from "solid-js"

export function DocumentSection(props: ComponentProps<"section">) {
    const rest = omit(props, "class", "children")
    return (
        <section {...rest} class={cx("animate-fade-up", props.class)}>
            {props.children}
        </section>
    )
}

type DocumentSectionBodyProps = ComponentProps<"div"> & {
    render?: (props: RenderProps) => JSX.Element
}

export function DocumentSectionBody(props: DocumentSectionBodyProps): JSX.Element {
    const rest = omit(props, "class", "children", "render")
    const merged = merge(rest, {
        get class() {
            if (props.render) {
                return cx("max-w-prose text-base/[1.8] text-stone-600 dark:text-stone-400", props.class)
            }
            return cx(
                "max-w-prose text-base/[1.8] text-stone-600 dark:text-stone-400",
                "flex flex-col gap-4",
                props.class,
            )
        },
        get children() {
            return props.children
        },
    })
    return <>{props.render?.(merged) ?? <div {...merged} />}</>
}
