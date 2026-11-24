import type { SearchOutcome } from "@core/search/pagefind"
import { SearchNoResults } from "@features/search/no-results"
import { SearchResults } from "@features/search/results"
import { SearchUnavailable } from "@features/search/unavailable"
import type { VoidProps } from "solid-js"

export function SearchOutcomeView(props: VoidProps<{ outcome: SearchOutcome; query: string; onClear: () => void }>) {
    const content = () => {
        const outcome = props.outcome
        switch (outcome.kind) {
            case "failure": {
                return <SearchUnavailable />
            }
            case "empty": {
                return <SearchNoResults query={props.query} onClear={props.onClear} />
            }
            case "hits": {
                return <SearchResults hits={outcome.hits} />
            }
            case "idle": {
                return null
            }
            default: {
                const exhaustive: never = outcome
                return exhaustive
            }
        }
    }
    return <>{content()}</>
}
