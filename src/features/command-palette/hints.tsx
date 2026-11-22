import { useCommandPalette } from "@features/command-palette/provider"
import { cx } from "@ui/cva.config"
import { Kbd } from "@ui/kbd"
import { Show } from "solid-js"

export function CommandPaletteHints() {
    const { state } = useCommandPalette()

    return (
        <div
            class={cx(
                "flex items-center gap-3 border-t border-stone-200 px-4 py-2 font-mono text-xs",
                "text-stone-600 dark:border-stone-800 dark:text-stone-400",
            )}
        >
            <span class="flex items-center gap-1">
                <Kbd>↑↓</Kbd>
                navigate
            </span>
            <span class="flex items-center gap-1">
                <Kbd>↵</Kbd>
                select
            </span>
            <Show
                when={state.isLoading()}
                fallback={
                    <span class="ml-auto flex items-center gap-1">
                        <Kbd>esc</Kbd>
                        close
                    </span>
                }
            >
                <span class="ml-auto motion-safe:animate-pulse">searching…</span>
            </Show>
        </div>
    )
}
