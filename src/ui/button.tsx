import type { ComponentProps } from "@solidjs/web"
import { cva, cx, type VariantProps } from "@ui/cva.config"
import { omit } from "solid-js"

const button = cva({
    base: "hit-area-x-2 hit-area-y-3.5 font-mono text-xs transition-[color,background-color,border-color,scale] duration-150 ease-out-quart active:scale-97",
    variants: {
        intent: {
            quiet: "text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100",
            muted: "text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-300",
            link: "text-stone-600 underline decoration-stone-300 underline-offset-2 hover:text-stone-700 dark:text-stone-400 dark:decoration-stone-600 dark:hover:text-stone-300",
        },
    },
    defaultVariants: {
        intent: "quiet",
    },
})

export function Button(props: Omit<ComponentProps<"button">, "type"> & VariantProps<typeof button>) {
    const rest = omit(props, "intent", "class", "children")

    return (
        <button {...rest} type="button" class={cx(button({ intent: props.intent, class: props.class }))}>
            {props.children}
        </button>
    )
}
