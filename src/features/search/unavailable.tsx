import { SearchPanelEmphasis } from "@features/search/panel"
import { EmptyRegister, EmptyRegisterNote, EmptyRegisterTitle } from "@pattern/register"
import { Anchor } from "@ui/anchor"

export function SearchUnavailable() {
    return (
        <EmptyRegister size="relaxed">
            <EmptyRegisterTitle>Search index unavailable.</EmptyRegisterTitle>
            <EmptyRegisterNote>
                Build the site first: <SearchPanelEmphasis>pnpm build</SearchPanelEmphasis> then{" "}
                <SearchPanelEmphasis>pnpm preview</SearchPanelEmphasis> or{" "}
                <SearchPanelEmphasis>pnpm dev:search</SearchPanelEmphasis>. Or browse{" "}
                <Anchor href="/logs" variant="prose">
                    ~/logs
                </Anchor>{" "}
                directly.
            </EmptyRegisterNote>
        </EmptyRegister>
    )
}
