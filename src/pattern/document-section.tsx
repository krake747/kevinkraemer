import { type ComponentProps, type JSX } from "@solidjs/web"
import { cx } from "@ui/cva.config"
import { renderElement, type WithRender } from "@ui/render"
import { merge, omit } from "solid-js"

export function DocumentSection(props: ComponentProps<"section">) {
    const rest = omit(props, "class", "children")
    return (
        <section {...rest} class={cx("animate-fade-up", props.class)}>
            {props.children}
        </section>
    )
}

export function DocumentSectionBody(props: ComponentProps<"div"> & WithRender): JSX.Element {
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
    return renderElement({ defaultTag: "div", render: () => props.render, props: () => merged })
}
