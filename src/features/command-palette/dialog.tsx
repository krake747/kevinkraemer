import { SEARCH_PLACEHOLDER } from "@core/search/pagefind"
import { CommandPaletteFailed } from "@features/command-palette/failed"
import { CommandPaletteHints } from "@features/command-palette/hints"
import { CommandPaletteProvider, useCommandPalette } from "@features/command-palette/provider"
import { CommandPaletteRowItem } from "@features/command-palette/row-item"
import { createMediaQuery } from "@solid-primitives/media"
import { Command, CommandEmpty, CommandGroup, CommandGroupLabel, CommandInput, CommandList } from "@ui/command"
import { Dialog, DialogBackdrop, DialogContent, DialogTitle } from "@ui/dialog"
import { Errored, For, createEffect, latest } from "solid-js"

export function CommandPaletteDialog(props: { open: boolean; onOpenChange: (next: boolean) => void }) {
    return (
        <CommandPaletteProvider close={() => props.onOpenChange(false)}>
            <CommandPaletteDialogBody open={props.open} onOpenChange={props.onOpenChange} />
        </CommandPaletteProvider>
    )
}

function CommandPaletteDialogBody(props: { open: boolean; onOpenChange: (next: boolean) => void }) {
    const { state, actions } = useCommandPalette()
    const close = () => props.onOpenChange(false)
    const isCoarsePointer = createMediaQuery("(pointer: coarse)")

    createEffect(
        () => props.open,
        (isOpen) => {
            if (isOpen) {
                actions.reset()
            }
        },
    )

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            event.preventDefault()
            event.stopPropagation()
            close()
        }
    }

    return (
        <Dialog open={props.open} onOpenChange={props.onOpenChange}>
            <DialogBackdrop />
            <DialogContent
                align="top"
                initialFocus={isCoarsePointer() ? "content" : "#command-palette-input"}
                onKeyDown={handleKeyDown}
            >
                <DialogTitle class="sr-only">Command palette</DialogTitle>
                <Command
                    query={latest(state.input)}
                    onQueryChange={actions.update}
                    filter={false}
                    autoHighlight
                    onAction={(value) => {
                        actions.run(value)
                    }}
                >
                    <div class="flex items-center gap-2 border-b border-stone-200 px-4 focus-within:border-emerald-600 dark:border-stone-800 dark:focus-within:border-emerald-400">
                        <span aria-hidden="true" class="font-mono text-sm text-emerald-800 dark:text-emerald-400">
                            $
                        </span>
                        <CommandInput
                            id="command-palette-input"
                            aria-label="Search commands and pages"
                            placeholder={SEARCH_PLACEHOLDER}
                            autocomplete="off"
                            spellcheck={false}
                        />
                    </div>
                    <Errored
                        fallback={(error, retry) => <CommandPaletteFailed message={String(error())} onRetry={retry} />}
                    >
                        <CommandEmpty>
                            <div class="px-4 py-6 text-center">
                                <span class="text-stone-600 dark:text-stone-400">command not found:</span>{" "}
                                <span class="text-stone-700 dark:text-stone-300">{state.input().trim()}</span>
                            </div>
                        </CommandEmpty>
                        <CommandList>
                            <For each={state.groups()} keyed={(group) => group.key}>
                                {(group) => (
                                    <CommandGroup>
                                        <CommandGroupLabel>{group().label}</CommandGroupLabel>
                                        <For each={group().rows} keyed={(row) => row.rowId}>
                                            {(row) => <CommandPaletteRowItem row={row()} />}
                                        </For>
                                    </CommandGroup>
                                )}
                            </For>
                        </CommandList>
                        <CommandPaletteHints />
                    </Errored>
                </Command>
            </DialogContent>
        </Dialog>
    )
}
