import type { ComponentProps } from "@solidjs/web"
import { cva, cx, type VariantProps } from "@ui/cva.config"
import { omit } from "solid-js"

const chip = cva({
    base: "hit-area-x-1 hit-area-y-3 inline-flex items-center border px-2 py-0.5 font-mono text-xs transition-[color,background-color,border-color,scale] duration-150 ease-out-quart active:scale-97",
    variants: {
        selected: {
            true: "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-400",
            false: "border-stone-300/60 bg-transparent text-stone-700 hover:border-stone-400 hover:bg-stone-100 dark:border-stone-700/60 dark:text-stone-400 dark:hover:border-stone-600 dark:hover:bg-stone-800/50",
        },
    },
    defaultVariants: {
        selected: false,
    },
})

export function Chip(props: Omit<ComponentProps<"button">, "type"> & VariantProps<typeof chip>) {
    const rest = omit(props, "selected", "class", "children")

    return (
        <button
            {...rest}
            type="button"
            aria-pressed={props.selected === true ? "true" : "false"}
            class={cx(chip({ selected: props.selected, class: props.class }))}
        >
            {props.children}
        </button>
    )
}
