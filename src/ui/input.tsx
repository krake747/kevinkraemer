import type { ComponentProps } from "@solidjs/web"
import { cx } from "@ui/cva.config"
import { omit, type ParentProps } from "solid-js"

export function Input(props: ParentProps<ComponentProps<"input">>) {
    const rest = omit(props, "class", "children")

    return (
        <label class="flex min-w-0 flex-1 items-center gap-2 border border-stone-300/60 bg-stone-100 pr-4 pl-3 transition-colors focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 dark:border-stone-700/60 dark:bg-stone-900">
            {props.children}
            <input
                {...rest}
                class={cx(
                    "min-w-0 flex-1 bg-transparent py-2.5 font-mono text-base text-stone-900 outline-none placeholder:text-stone-600 sm:text-sm dark:text-stone-100 dark:placeholder:text-stone-400",
                    props.class,
                )}
            />
        </label>
    )
}

export function InputPrompt() {
    return (
        <span aria-hidden="true" class="font-mono text-sm text-emerald-700 dark:text-emerald-400">
            $
        </span>
    )
}
