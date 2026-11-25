import type { SearchHit } from "@core/search/pagefind"
import { Register, RegisterRow, RegisterRowDescription, RegisterRowMeta, RegisterRowTitle } from "@pattern/register"
import { For, type VoidProps } from "solid-js"

export function SearchResults(props: VoidProps<{ hits: SearchHit[] }>) {
    return (
        <Register render={(renderProps) => <ul {...renderProps} />}>
            <For each={props.hits} keyed={(hit) => hit.href}>
                {(hit) => (
                    <RegisterRow render={(renderProps) => <li {...renderProps} />} href={hit().href}>
                        <RegisterRowTitle>{hit().title}</RegisterRowTitle>
                        <RegisterRowDescription lines={2}>{hit().excerpt}</RegisterRowDescription>
                        <RegisterRowMeta>
                            <span>{hit().href}</span>
                        </RegisterRowMeta>
                    </RegisterRow>
                )}
            </For>
        </Register>
    )
}
