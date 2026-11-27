import { createScrollReveal } from "@pattern/create-scroll-reveal"
import type { ComponentProps } from "@solidjs/web"
import { cx } from "@ui/cva.config"
import { ChevronRightIcon } from "@ui/icon"
import { omit, type VoidProps } from "solid-js"

export function TerminalCommandHeader(props: VoidProps<ComponentProps<"p"> & { command: string }>) {
    const rest = omit(props, "command", "class")

    return (
        <p
            {...rest}
            class={cx("flex items-center gap-2 font-mono text-xs text-stone-600 dark:text-stone-300", props.class)}
        >
            <ChevronRightIcon class="size-3.5 text-emerald-800 dark:text-emerald-400" />
            <span>{props.command}</span>
        </p>
    )
}

type TerminalSectionProps = Omit<ComponentProps<"section">, "id"> & { id: string }

export function TerminalSection(props: TerminalSectionProps) {
    const commandId = (): string => `${props.id}-command`
    const rest = omit(props, "class", "children", "id")
    const reveal = createScrollReveal()
    return (
        <section
            {...rest}
            id={props.id}
            aria-labelledby={commandId()}
            ref={reveal}
            class={cx(
                "reveal-section border-t border-stone-200 px-4 py-16 sm:px-6 sm:py-20 md:px-12 lg:px-24 dark:border-stone-800",
                props.class,
            )}
        >
            <div class="mx-auto max-w-6xl">{props.children}</div>
        </section>
    )
}
