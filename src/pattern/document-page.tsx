import { PageColumn } from "@pattern/page-column"
import { PageHeader } from "@pattern/page-header"
import type { ParentProps } from "solid-js"

type DocumentPageProps = ParentProps<{
    command: string
    title: string
}>

export function DocumentPage(props: DocumentPageProps) {
    return (
        <PageColumn>
            <div class="mx-auto flex max-w-4xl flex-col gap-10 kk-cascade">
                <PageHeader command={props.command} title={props.title} class="animate-rise" />
                {props.children}
            </div>
        </PageColumn>
    )
}
