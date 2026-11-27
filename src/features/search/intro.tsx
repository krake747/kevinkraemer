import { SearchShortcuts } from "@features/search/shortcuts"
import { StackRow } from "@pattern/stack"
import { formatShortcut } from "@ui-sdk/core"
import { cx } from "@ui/cva.config"
import { InlineCode } from "@ui/inline-code"
import { Kbd } from "@ui/kbd"
import { createSignal, onSettled, type ParentProps } from "solid-js"

function SearchIntroNote(props: ParentProps<{ class?: string }>) {
    return <p class={cx("font-mono text-xs text-stone-600 dark:text-stone-400", props.class)}>{props.children}</p>
}

export function SearchIntro() {
    const [shortcutHint, setShortcutHint] = createSignal(formatShortcut("mod+k", false))
    onSettled(() => {
        setShortcutHint(formatShortcut("mod+k"))
    })

    return (
        <StackRow size="roomy">
            <SearchIntroNote>Type 2+ characters to grep the site. Or browse:</SearchIntroNote>
            <SearchShortcuts />
            <SearchIntroNote class="mt-4">
                Tip 1: every search has a shareable URL: <InlineCode>/search?q={"<query>"}</InlineCode>
            </SearchIntroNote>
            <SearchIntroNote class="mt-4">
                Tip 2: press <Kbd>{shortcutHint()}</Kbd> anywhere to open the command palette.
            </SearchIntroNote>
        </StackRow>
    )
}
