import type { ComponentProps } from "@solidjs/web"
import { cx } from "@ui/cva.config"
import { ChevronRight } from "@ui/icon"
import { omit, type VoidProps } from "solid-js"

export function TerminalCommandHeader(props: VoidProps<ComponentProps<"p"> & { command: string }>) {
    const rest = omit(props, "command", "class")

    return (
        <p
            {...rest}
            class={cx("flex items-center gap-2 font-mono text-xs text-stone-600 dark:text-stone-300", props.class)}
        >
            <ChevronRight class="size-3 text-emerald-800 dark:text-emerald-400" />
            <span>{props.command}</span>
        </p>
    )
}
