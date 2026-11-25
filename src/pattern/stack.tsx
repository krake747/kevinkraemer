import { type ComponentProps, type JSX } from "@solidjs/web"
import { cva, cx, type VariantProps } from "@ui/cva.config"
import { renderElement, type WithRender } from "@ui/render"
import { merge, omit } from "solid-js"

type StackProps = ComponentProps<"div"> & WithRender

export function Stack(props: StackProps): JSX.Element {
    const rest = omit(props, "class", "children", "render")
    const merged = merge(rest, {
        get class() {
            return cx("m-0 flex list-none flex-col gap-2 p-0", props.class)
        },
        get children() {
            return props.children
        },
    })
    return renderElement({ defaultTag: "div", render: () => props.render, props: () => merged })
}

export const stackRow = cva({
    base: "border border-stone-200/80 bg-stone-100 dark:border-stone-800 dark:bg-stone-900",
    variants: {
        size: {
            default: "px-4 py-5",
            compact: "px-4 py-3",
            relaxed: "px-4 py-6",
            roomy: "px-4 py-8",
            spacious: "px-4 py-12",
        },
        interactive: {
            true: "group transition-colors hover:bg-emerald-500/3 dark:hover:bg-emerald-500/5",
            false: "",
        },
    },
    defaultVariants: {
        size: "default",
        interactive: false,
    },
})

export function StackRow(props: ComponentProps<"div"> & VariantProps<typeof stackRow> & WithRender): JSX.Element {
    const rest = omit(props, "size", "interactive", "class", "children", "render")
    const merged = merge(rest, {
        get class() {
            return cx(stackRow({ size: props.size, interactive: props.interactive, class: props.class }))
        },
        get children() {
            return props.children
        },
    })
    return renderElement({ defaultTag: "div", render: () => props.render, props: () => merged })
}
