import { SearchPanelNote, SearchPanelTitle } from "@features/search/panel"
import { Button } from "@ui/button"
import { StackRow } from "@ui/stack-row"
import type { VoidProps } from "solid-js"

export function SearchFailed(props: VoidProps<{ message: string; onRetry: () => void }>) {
    return (
        <StackRow size="relaxed" class="text-center">
            <SearchPanelTitle>Search failed.</SearchPanelTitle>
            <SearchPanelNote class="mt-2">{props.message}</SearchPanelNote>
            <Button intent="link" class="mt-4" onClick={() => props.onRetry()}>
                retry
            </Button>
        </StackRow>
    )
}
