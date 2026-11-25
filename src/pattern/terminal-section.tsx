import { createScrollReveal } from "@pattern/create-scroll-reveal"
import type { ComponentProps } from "@solidjs/web"
import { cx } from "@ui/cva.config"
import { omit } from "solid-js"

type TerminalSectionProps = ComponentProps<"section">

export function TerminalSection(props: TerminalSectionProps) {
    const commandId = (): string | undefined => {
        if (props.id) {
            return `${props.id}-command`
        }
        return undefined
    }
    const rest = omit(props, "class", "children")
    const reveal = createScrollReveal()
    return (
        <section
            {...rest}
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
