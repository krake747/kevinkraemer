import { PageShell } from "@pattern/page-shell"
import type { JSX } from "@solidjs/web"
import { TerminalCommandHeader } from "@ui/terminal-command-header"
import type { ParentProps } from "solid-js"

type ProseShellProps = ParentProps<{
    command: string
    title: string
    lede?: JSX.Element
}>

export function ProseShell(props: ProseShellProps) {
    return (
        <PageShell>
            <div class="mx-auto flex max-w-4xl flex-col gap-10 kk-cascade">
                <header class="animate-rise">
                    <TerminalCommandHeader command={props.command} class="mb-4" />
                    <h1 class="text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                        {props.title}
                    </h1>
                    <p class="mt-3 max-w-prose text-sm leading-relaxed text-stone-600 empty:hidden dark:text-stone-400">
                        {props.lede}
                    </p>
                </header>
                {props.children}
            </div>
        </PageShell>
    )
}
