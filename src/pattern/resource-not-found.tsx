import { PageShell } from "@pattern/page-shell"
import { Anchor } from "@ui/anchor"
import { ChevronLeft } from "@ui/icon"
import { TerminalCommandHeader } from "@ui/terminal-command-header"
import type { VoidProps } from "solid-js"

type ResourceNotFoundProps = {
    title: string
    backHref: string
    backLabel: string
}

export function ResourceNotFound(props: VoidProps<ResourceNotFoundProps>) {
    return (
        <PageShell>
            <TerminalCommandHeader command="cat missing.txt" class="mb-8 w-fit" />
            <h1 class="text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">{props.title}</h1>
            <Anchor href={props.backHref} variant="muted" class="mt-6 inline-flex items-center gap-1.5">
                <ChevronLeft class="size-3 shrink-0" />
                {props.backLabel}
            </Anchor>
        </PageShell>
    )
}
