import { SearchPanelNote } from "@features/search/panel"
import { SearchShortcuts } from "@features/search/shortcuts"
import { StackRow } from "@pattern/stack"
import { formatShortcut } from "@ui-sdk/core"
import { InlineCode } from "@ui/inline-code"
import { Kbd } from "@ui/kbd"
import { createSignal, onSettled } from "solid-js"

export function SearchIntro() {
    const [shortcutHint, setShortcutHint] = createSignal(formatShortcut("mod+k", false))
    onSettled(() => {
        setShortcutHint(formatShortcut("mod+k"))
    })

    return (
        <StackRow size="roomy">
            <SearchPanelNote>Type 2+ characters to grep the site. Or browse:</SearchPanelNote>
            <SearchShortcuts />
            <SearchPanelNote class="mt-4">
                Tip 1: every search has a shareable URL: <InlineCode>/search?q={"<query>"}</InlineCode>
            </SearchPanelNote>
            <SearchPanelNote class="mt-4">
                Tip 2: press <Kbd>{shortcutHint()}</Kbd> anywhere to open the command palette.
            </SearchPanelNote>
        </StackRow>
    )
}
