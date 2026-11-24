import { PAGEFIND_DEBOUNCE_MS, type SearchHit } from "@core/search/pagefind"
import {
    getCommandPaletteCommands,
    matchCommandPaletteCommands,
    type CommandPaletteActionId,
    type CommandPaletteCommand,
} from "@features/command-palette/commands"
import { createDebouncedInput } from "@pattern/create-debounced-input"
import { createPagefindSearch } from "@pattern/create-pagefind-search"
import type { Component } from "solid-js"
import { createMemo, createSignal } from "solid-js"

export type CommandPaletteRow = {
    rowId: string
    label: string
    icon: Component<{ class?: string }> | null
    flash?: { id: CommandPaletteActionId; label: string }
    run: () => void
}

export type CommandPaletteGroup = {
    key: string
    label: string
    rows: CommandPaletteRow[]
}

type CommandPaletteDeps = {
    close: () => void
    navigate: (href: string) => void
    openExternal: (href: string) => void
    runAction: (id: CommandPaletteActionId) => void
}

const GROUP_LABELS = [
    ["pages", "$ ls pages/"],
    ["actions", "$ alias"],
] as const

function commandRowId(command: CommandPaletteCommand): string {
    return command.kind === "action" ? `cmd-action-${command.id}` : `cmd-${command.kind}-${command.href}`
}

function commandRun(command: CommandPaletteCommand, deps: CommandPaletteDeps): () => void {
    switch (command.kind) {
        case "route": {
            return () => {
                deps.close()
                deps.navigate(command.href)
            }
        }
        case "external": {
            return () => {
                deps.close()
                deps.openExternal(command.href)
            }
        }
        case "action": {
            return () => {
                deps.runAction(command.id)
            }
        }
        default: {
            const exhaustive: never = command
            return exhaustive
        }
    }
}

function commandRow(command: CommandPaletteCommand, deps: CommandPaletteDeps): CommandPaletteRow {
    const flash =
        command.kind === "action" && command.flashLabel !== undefined
            ? { id: command.id, label: command.flashLabel }
            : undefined
    return {
        rowId: commandRowId(command),
        label: command.label,
        icon: command.icon,
        flash,
        run: commandRun(command, deps),
    }
}

function hitRow(hit: SearchHit, deps: CommandPaletteDeps): CommandPaletteRow {
    return {
        rowId: `hit-${hit.href}`,
        label: hit.title,
        icon: null,
        run: () => {
            deps.close()
            deps.navigate(hit.href)
        },
    }
}

function hasRows(group: CommandPaletteGroup): boolean {
    return group.rows.length > 0
}

function toCommandRow(deps: CommandPaletteDeps): (command: CommandPaletteCommand) => CommandPaletteRow {
    return (command) => {
        return commandRow(command, deps)
    }
}

function toHitRow(deps: CommandPaletteDeps): (hit: SearchHit) => CommandPaletteRow {
    return (hit) => {
        return hitRow(hit, deps)
    }
}

function toCommandGroup(
    commands: CommandPaletteCommand[],
    deps: CommandPaletteDeps,
): (label: readonly ["pages" | "actions", string]) => CommandPaletteGroup {
    return ([key, label]) => {
        return { key, label, rows: commands.filter((command) => command.group === key).map(toCommandRow(deps)) }
    }
}

export function buildCommandPaletteGroups(
    commands: CommandPaletteCommand[],
    hits: SearchHit[],
    deps: CommandPaletteDeps,
): CommandPaletteGroup[] {
    return [
        ...GROUP_LABELS.map(toCommandGroup(commands, deps)),
        { key: "hits", label: "$ grep -r", rows: hits.map(toHitRow(deps)) },
    ].filter(hasRows)
}

export function createCommandPalette(deps: CommandPaletteDeps) {
    const commands = getCommandPaletteCommands()
    const [query, setQuery] = createSignal("")
    const {
        input,
        update,
        reset: resetInput,
    } = createDebouncedInput({
        commit: (value) => setQuery(value),
        wait: PAGEFIND_DEBOUNCE_MS,
        source: () => "",
    })
    const { hits, isLoading } = createPagefindSearch(query)
    const groups = createMemo(() =>
        buildCommandPaletteGroups(matchCommandPaletteCommands(input(), commands), hits(), deps),
    )
    const rows = createMemo(() => groups().flatMap((group) => group.rows))
    const run = (rowId: string) => {
        const row = rows().find((candidate) => candidate.rowId === rowId)
        if (row !== undefined) {
            row.run()
        }
    }
    const reset = () => {
        resetInput()
        setQuery("")
    }
    return { input, groups, update, reset, run, isLoading }
}
