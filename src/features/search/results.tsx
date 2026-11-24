import type { SearchHit } from "@core/search/pagefind"
import { SearchHitRow } from "@features/search/hit-row"
import { Register } from "@pattern/register"
import { For, type VoidProps } from "solid-js"

export function SearchResults(props: VoidProps<{ hits: SearchHit[] }>) {
    return (
        <Register as="ul">
            <For each={props.hits} keyed={(hit) => hit.href}>
                {(hit) => <SearchHitRow hit={hit()} />}
            </For>
        </Register>
    )
}
