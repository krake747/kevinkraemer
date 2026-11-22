import { SearchPanelNote, SearchPanelTitle } from "@features/search/panel"
import { Anchor } from "@ui/anchor"
import { Button } from "@ui/button"
import { StackRow } from "@ui/stack-row"

export function SearchNoResults(props: { query: string; onClear: () => void }) {
    return (
        <StackRow size="spacious" class="text-center">
            <SearchPanelTitle>
                <span class="text-stone-600 dark:text-stone-400">command not found:</span> {props.query}
            </SearchPanelTitle>
            <SearchPanelNote class="mt-2">
                No hits. Try a broader term, or browse{" "}
                <Anchor href="/logs" variant="prose">
                    ~/logs
                </Anchor>
                .
            </SearchPanelNote>
            <Button intent="link" class="mt-4" onClick={() => props.onClear()}>
                clear query
            </Button>
        </StackRow>
    )
}
