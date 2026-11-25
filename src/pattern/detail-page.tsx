import { PageColumn } from "@pattern/page-column"
import { Seo } from "@pattern/seo"
import type { ComponentProps } from "@solidjs/web"
import type { ParentProps } from "solid-js"

export function DetailPage(
    props: ParentProps<{
        seo: ComponentProps<typeof Seo>
    }>,
) {
    return (
        <PageColumn>
            <Seo {...props.seo} />
            {props.children}
        </PageColumn>
    )
}
