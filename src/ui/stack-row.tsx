import { dynamic, type ComponentProps, type ValidComponent } from "@solidjs/web"
import { cva, cx, type VariantProps } from "@ui/cva.config"
import { merge, omit, isStatic } from "solid-js"

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

export function StackRow<T extends ValidComponent = "div">(
    _props: ComponentProps<T> & VariantProps<typeof stackRow> & { as?: T },
) {
    const props = merge({ as: "div" } as const, _props)
    const Tag = dynamic(() => props.as, { static: isStatic(_props, "as") })
    const rest = omit(props, "as", "size", "interactive", "class", "children")

    return (
        <Tag {...rest} class={cx(stackRow({ size: props.size, interactive: props.interactive, class: props.class }))}>
            {props.children}
        </Tag>
    )
}
