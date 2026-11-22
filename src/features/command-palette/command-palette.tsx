import { createBrowserValue } from "@pattern/create-browser-value"
import { WindowEventListener } from "@solid-primitives/event-listener"
import { ariaKeyshortcuts, formatShortcut, matchesShortcut } from "@ui-sdk/core"
import { anchor } from "@ui/anchor"
import { cx } from "@ui/cva.config"
import { Search } from "@ui/icon"
import { Kbd } from "@ui/kbd"
import { Loading, Show, createSignal, lazy } from "solid-js"

const PaletteDialog = lazy(() =>
    import("@features/command-palette/dialog").then((module) => ({
        default: module.CommandPaletteDialog,
    })),
)

export function CommandPalette() {
    const [open, setOpen] = createSignal(false)
    const [mounted, setMounted] = createSignal(false)
    const shortcutHint = createBrowserValue(
        { label: formatShortcut("mod+k", false), aria: ariaKeyshortcuts("mod+k", false) },
        () => ({ label: formatShortcut("mod+k"), aria: ariaKeyshortcuts("mod+k") }),
    )

    const ensureMounted = () => {
        if (!mounted()) {
            setMounted(true)
        }
    }

    const handleShortcut = (event: KeyboardEvent) => {
        if (matchesShortcut(event, "mod+k")) {
            event.preventDefault()
            ensureMounted()
            setOpen((wasOpen) => !wasOpen)
        }
    }

    return (
        <>
            <WindowEventListener onKeydown={handleShortcut} />
            <button
                type="button"
                aria-label="Open command palette"
                aria-keyshortcuts={shortcutHint().aria}
                aria-haspopup="dialog"
                aria-expanded={open() ? "true" : "false"}
                onMouseEnter={ensureMounted}
                onFocusIn={ensureMounted}
                onClick={() => {
                    ensureMounted()
                    setOpen(true)
                }}
                class={cx("hit-area-x-3 hit-area-y-3 flex items-center gap-1.5", anchor({ variant: "subtle" }))}
            >
                <Search class="size-4 opacity-70" />
                <Kbd>{shortcutHint().label}</Kbd>
            </button>
            <Show when={mounted()}>
                <Loading fallback={null}>
                    <PaletteDialog open={open()} onOpenChange={setOpen} />
                </Loading>
            </Show>
        </>
    )
}
