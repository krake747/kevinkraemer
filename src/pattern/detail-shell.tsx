import { canonicalFor } from "@core/site/urls"
import { PageShell } from "@pattern/page-shell"
import { Seo } from "@pattern/seo"
import type { ComponentProps } from "@solidjs/web"
import type { ParentProps } from "solid-js"

type Crumb = { name: string; url?: string }

export function sectionTrail(sectionName: string, sectionPath: string, currentName: string): Crumb[] {
    return [
        { name: "Home", url: canonicalFor("/") },
        { name: sectionName, url: canonicalFor(sectionPath) },
        { name: currentName },
    ]
}

type DetailShellProps = ParentProps<{
    seo: ComponentProps<typeof Seo>
}>

export function DetailShell(props: DetailShellProps) {
    return (
        <PageShell>
            <Seo {...props.seo} />
            {props.children}
        </PageShell>
    )
}
