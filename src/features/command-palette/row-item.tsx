import type { CommandPaletteRow } from "@features/command-palette/create-palette"
import { useCommandPalette } from "@features/command-palette/provider"
import { dynamic } from "@solidjs/web"
import { CommandItem } from "@ui/command"
import { ArrowRightIcon } from "@ui/icon"
import { Show, createMemo, type VoidProps } from "solid-js"

export function CommandPaletteRowItem(props: VoidProps<{ row: CommandPaletteRow }>) {
    const { state } = useCommandPalette()
    const label = createMemo(() => {
        const flash = props.row.flash
        if (flash.kind === "flash" && flash.id === state.flashedAction()) {
            return { text: flash.label, flashed: true }
        }
        return { text: props.row.label, flashed: false }
    })

    return (
        <CommandItem value={props.row.rowId} label={label().text}>
            <Show when={props.row.icon}>
                {(icon) => {
                    const Icon = dynamic(icon)
                    return <Icon class="size-4 shrink-0 opacity-70" />
                }}
            </Show>
            <span class="min-w-0 flex-1 truncate">
                <Show when={label().flashed} fallback={label().text}>
                    <span class="animate-confirm-in">{label().text}</span>
                </Show>
            </span>
            <ArrowRightIcon class="size-3.5 shrink-0 opacity-0 in-data-highlighted:opacity-100" />
        </CommandItem>
    )
}
