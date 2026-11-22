import type { SearchOutcome } from "@core/search/pagefind"
import { SearchNoResults } from "@features/search/no-results"
import { SearchResults } from "@features/search/results"
import { SearchUnavailable } from "@features/search/unavailable"
import { Match, Switch } from "solid-js"

export function SearchOutcomeView(props: { outcome: SearchOutcome; query: string; onClear: () => void }) {
    const hits = () => (props.outcome.kind === "hits" ? props.outcome.hits : [])

    return (
        <Switch fallback={<SearchNoResults query={props.query} onClear={props.onClear} />}>
            <Match when={props.outcome.kind === "failure"}>
                <SearchUnavailable />
            </Match>
            <Match when={hits().length > 0}>
                <SearchResults hits={hits()} />
            </Match>
        </Switch>
    )
}
