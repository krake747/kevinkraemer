import { DossierHead } from "@pattern/dossier-head"
import { PageShell } from "@pattern/page-shell"
import { ReturnToRegister } from "@pattern/register"
import type { VoidProps } from "solid-js"

type ResourceNotFoundProps = {
    title: string
    backHref: string
    backLabel: string
}

export function ResourceNotFound(props: VoidProps<ResourceNotFoundProps>) {
    return (
        <PageShell>
            <DossierHead command="cat missing.txt" title={props.title} />
            <ReturnToRegister href={props.backHref} label={props.backLabel} class="mt-6" />
        </PageShell>
    )
}
