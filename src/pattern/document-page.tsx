import { PageColumn } from "@pattern/page-column"
import type { ParentProps } from "solid-js"

export function DocumentPage(props: ParentProps) {
    return (
        <PageColumn>
            <div class="mx-auto flex max-w-4xl flex-col gap-8 kk-cascade">{props.children}</div>
        </PageColumn>
    )
}
