import { cva, cx, type VariantProps } from "@ui/cva.config"
import { StackRow } from "@ui/stack-row"
import type { ParentProps } from "solid-js"

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

type RecordRowProps = ParentProps<
    {
        label: string
        as?: "div" | "li"
        class?: string
    } & VariantProps<typeof recordRow>
>

export function RecordRow(props: RecordRowProps) {
    return (
        <StackRow as={props.as ?? "div"} class={cx(recordRow({ width: props.width, class: props.class }))}>
            <dt class="font-mono text-xs tracking-widest text-stone-600 uppercase dark:text-stone-400">
                {props.label}
            </dt>
            {props.children}
        </StackRow>
    )
}
