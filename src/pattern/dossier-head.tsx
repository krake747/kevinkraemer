import type { JSX } from "@solidjs/web"
import { cva, cx, type VariantProps } from "@ui/cva.config"
import { TerminalCommandHeader } from "@ui/terminal-command-header"
import { Show } from "solid-js"

const dossierLede = cva({
    base: "mt-3 max-w-prose text-sm/relaxed text-stone-600 empty:hidden dark:text-stone-400",
    variants: {
        tone: {
            sans: "",
            mono: "font-mono",
        },
    },
    defaultVariants: {
        tone: "sans",
    },
})

type DossierHeadProps = {
    command: string
    title: string
    lede?: JSX.Element
    meta?: JSX.Element
    class?: string
} & VariantProps<typeof dossierLede>

export function DossierHead(props: DossierHeadProps) {
    return (
        <header class={cx(props.class)}>
            <TerminalCommandHeader command={props.command} class="mb-4" />
            <h1 class="text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">{props.title}</h1>
            <p class={cx(dossierLede({ tone: props.tone }))}>{props.lede}</p>
            <Show when={props.meta}>{(meta) => <div class="mt-4">{meta()}</div>}</Show>
        </header>
    )
}
