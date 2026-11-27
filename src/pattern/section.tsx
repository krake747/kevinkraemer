import { type ComponentProps, type JSX } from "@solidjs/web"
import { cx } from "@ui/cva.config"
import { HashIcon } from "@ui/icon"
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

export function SectionHeading(props: ComponentProps<"h2">) {
    const rest = omit(props, "class", "children")
    return (
        <h2
            {...rest}
            class={cx("mb-4 flex items-center gap-2 font-mono text-xs text-stone-600 dark:text-stone-300", props.class)}
        >
            <HashIcon class="size-3.5 text-emerald-800 dark:text-emerald-400" />
            <span>{props.children}</span>
        </h2>
    )
}

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
