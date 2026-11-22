import type { SearchHit } from "@core/search/pagefind"
import { SearchHitRow } from "@features/search/hit-row"
import { Stack } from "@ui/stack"
import { For } from "solid-js"

export function SearchResults(props: { hits: SearchHit[] }) {
    return (
        <Stack as="ul">
            <For each={props.hits} keyed={(hit) => hit.href}>
                {(hit) => <SearchHitRow hit={hit()} />}
            </For>
        </Stack>
    )
}
