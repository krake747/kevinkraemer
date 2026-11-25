import { StackRow } from "@pattern/stack"
import type { ComponentProps } from "@solidjs/web"
import { cva, cx, type VariantProps } from "@ui/cva.config"
import { omit } from "solid-js"

const recordRow = cva({
    base: "grid gap-1 sm:items-baseline sm:gap-4",
    variants: {
        width: {
            sm: "sm:grid-cols-[minmax(0,10rem)_1fr]",
            md: "sm:grid-cols-[minmax(0,12rem)_1fr]",
            lg: "sm:grid-cols-[minmax(0,16rem)_1fr]",
        },
    },
    defaultVariants: {
        width: "sm",
    },
})

export function RecordRow(props: ComponentProps<"div"> & VariantProps<typeof recordRow> & { render?: never }) {
    const rest = omit(props, "class", "children", "width", "render")
    return (
        <StackRow {...rest} class={cx(recordRow({ width: props.width, class: props.class }))}>
            {props.children}
        </StackRow>
    )
}

export function RecordRowLabel(props: ComponentProps<"dt">) {
    const rest = omit(props, "class", "children")
    return (
        <dt
            {...rest}
            class={cx("font-mono text-xs tracking-widest text-stone-600 uppercase dark:text-stone-400", props.class)}
        >
            {props.children}
        </dt>
    )
}
