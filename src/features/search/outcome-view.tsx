import type { SearchOutcome } from "@core/search/pagefind"
import { SearchNoResults } from "@features/search/no-results"
import { SearchResults } from "@features/search/results"
import { SearchUnavailable } from "@features/search/unavailable"
import { Match, Switch, type VoidProps } from "solid-js"

export function SearchOutcomeView(props: VoidProps<{ outcome: SearchOutcome; query: string; onClear: () => void }>) {
    const hits = () => (props.outcome.kind === "hits" ? props.outcome.hits : undefined)

    return (
        <Switch fallback={null}>
            <Match when={props.outcome.kind === "failure"}>
                <SearchUnavailable />
            </Match>
            <Match when={props.outcome.kind === "empty"}>
                <SearchNoResults query={props.query} onClear={props.onClear} />
            </Match>
            <Match when={hits()}>{(matched) => <SearchResults hits={matched()} />}</Match>
        </Switch>
    )
}
