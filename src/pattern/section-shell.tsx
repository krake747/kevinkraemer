import { createScrollReveal } from "@pattern/create-scroll-reveal"
import type { ComponentProps } from "@solidjs/web"
import { cx } from "@ui/cva.config"
import { TerminalCommandHeader } from "@ui/terminal-command-header"

type SectionShellProps = ComponentProps<"section"> & {
    command: string
}

function shellClass(className?: ComponentProps<"section">["class"]): string {
    return cx(
        "reveal-section border-t border-stone-200 px-4 py-16 sm:px-6 sm:py-20 md:px-12 lg:px-24 dark:border-stone-800",
        className,
    )
}

export function SectionShell(props: SectionShellProps) {
    const reveal = createScrollReveal()
    return (
        <section id={props.id} ref={reveal} class={shellClass(props.class)}>
            <div class="mx-auto max-w-6xl">
                <TerminalCommandHeader command={props.command} class="reveal-item mb-8" />
                {props.children}
            </div>
        </section>
    )
}
