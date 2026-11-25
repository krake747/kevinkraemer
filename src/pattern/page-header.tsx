import type { JSX } from "@solidjs/web"
import { cx } from "@ui/cva.config"
import { TerminalCommandHeader } from "@ui/terminal-command-header"
import { Show } from "solid-js"

type PageHeaderProps = {
    command: string
    title: string
    meta?: JSX.Element
    class?: string
}

export function PageHeader(props: PageHeaderProps) {
    return (
        <header class={cx(props.class)}>
            <TerminalCommandHeader command={props.command} class="mb-4" />
            <h1 class="text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">{props.title}</h1>
            <Show when={props.meta}>{(meta) => <div class="mt-4">{meta()}</div>}</Show>
        </header>
    )
}
