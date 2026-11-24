import { DossierHead } from "@pattern/dossier-head"
import { PageShell } from "@pattern/page-shell"
import type { JSX } from "@solidjs/web"
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
                <DossierHead command={props.command} title={props.title} lede={props.lede} class="animate-rise" />
                {props.children}
            </div>
        </PageShell>
    )
}
