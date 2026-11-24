import { canonicalFor } from "@core/site/urls"
import { PageColumn } from "@pattern/page-column"
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

type DetailPageProps = ParentProps<{
    seo: ComponentProps<typeof Seo>
}>

export function DetailPage(props: DetailPageProps) {
    return (
        <PageColumn>
            <Seo {...props.seo} />
            {props.children}
        </PageColumn>
    )
}
