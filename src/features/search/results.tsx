import type { SearchHit } from "@core/search/pagefind"
import { Register, RegisterRow } from "@pattern/register"
import { For, type VoidProps } from "solid-js"

export function SearchResults(props: VoidProps<{ hits: SearchHit[] }>) {
    return (
        <Register as="ul">
            <For each={props.hits} keyed={(hit) => hit.href}>
                {(hit) => (
                    <RegisterRow
                        as="li"
                        href={hit().href}
                        title={hit().title}
                        description={hit().excerpt}
                        lines={2}
                        meta={<span>{hit().href}</span>}
                    />
                )}
            </For>
        </Register>
    )
}
