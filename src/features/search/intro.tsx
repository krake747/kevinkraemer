import { SearchPanelNote } from "@features/search/panel"
import { SearchShortcuts } from "@features/search/shortcuts"
import { Kbd } from "@ui/kbd"
import { StackRow } from "@ui/stack-row"

export function SearchIntro() {
    return (
        <StackRow size="roomy">
            <SearchPanelNote>Type 2+ characters to grep the site. Or browse:</SearchPanelNote>
            <SearchShortcuts />
            <SearchPanelNote class="mt-4">
                Tip: press <Kbd>⌘K</Kbd> anywhere to open the command palette.
            </SearchPanelNote>
        </StackRow>
    )
}
