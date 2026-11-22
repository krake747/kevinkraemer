import { SearchPanelEmphasis, SearchPanelNote, SearchPanelTitle } from "@features/search/panel"
import { Anchor } from "@ui/anchor"
import { StackRow } from "@ui/stack-row"

export function SearchUnavailable() {
    return (
        <StackRow size="relaxed" class="text-center">
            <SearchPanelTitle>Search index unavailable.</SearchPanelTitle>
            <SearchPanelNote class="mt-2 leading-relaxed">
                Build the site first: <SearchPanelEmphasis>pnpm build</SearchPanelEmphasis> then{" "}
                <SearchPanelEmphasis>pnpm preview</SearchPanelEmphasis> or{" "}
                <SearchPanelEmphasis>pnpm dev:search</SearchPanelEmphasis>. Or browse{" "}
                <Anchor href="/logs" variant="prose">
                    ~/logs
                </Anchor>{" "}
                directly.
            </SearchPanelNote>
        </StackRow>
    )
}
