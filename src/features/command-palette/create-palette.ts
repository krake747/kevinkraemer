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

type CommandPaletteRowFlash = { kind: "flash"; id: CommandPaletteActionId; label: string } | { kind: "none" }

type CommandPaletteRowAction =
    | { kind: "navigate"; href: string }
    | { kind: "external"; href: string }
    | { kind: "runAction"; id: CommandPaletteActionId }

export type CommandPaletteRow = {
    rowId: string
    label: string
    icon: Component<{ class?: string }> | null
    flash: CommandPaletteRowFlash
    href?: string
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

function executeRowAction(action: CommandPaletteRowAction, deps: CommandPaletteDeps): void {
    switch (action.kind) {
        case "navigate": {
            deps.close()
            deps.navigate(action.href)
            return
        }
        case "external": {
            deps.close()
            deps.openExternal(action.href)
            return
        }
        case "runAction": {
            deps.runAction(action.id)
            return
        }
        default: {
            const exhaustive: never = action
            return exhaustive
        }
    }
}

function rowAction(command: CommandPaletteCommand): CommandPaletteRowAction {
    switch (command.kind) {
        case "route": {
            return { kind: "navigate", href: command.href }
        }
        case "external": {
            return { kind: "external", href: command.href }
        }
        case "action": {
            return { kind: "runAction", id: command.id }
        }
        default: {
            const exhaustive: never = command
            return exhaustive
        }
    }
}

function rowFlash(command: CommandPaletteCommand): CommandPaletteRowFlash {
    if (command.kind === "action" && command.flashLabel !== undefined) {
        return { kind: "flash", id: command.id, label: command.flashLabel }
    }
    return { kind: "none" }
}

function commandRow(command: CommandPaletteCommand, deps: CommandPaletteDeps): CommandPaletteRow {
    const action = rowAction(command)
    return {
        rowId: commandRowId(command),
        label: command.label,
        icon: command.icon,
        flash: rowFlash(command),
        href: action.kind === "navigate" ? action.href : undefined,
        run: () => executeRowAction(action, deps),
    }
}

function hitRow(hit: SearchHit, deps: CommandPaletteDeps): CommandPaletteRow {
    const action: CommandPaletteRowAction = { kind: "navigate", href: hit.href }
    return {
        rowId: `hit-${hit.href}`,
        label: hit.title,
        icon: null,
        flash: { kind: "none" },
        href: action.href,
        run: () => executeRowAction(action, deps),
    }
}

function hasRows(group: CommandPaletteGroup): boolean {
    return group.rows.length > 0
}

function toCommandRow(deps: CommandPaletteDeps): (command: CommandPaletteCommand) => CommandPaletteRow {
    return (command) => commandRow(command, deps)
}

function toHitRow(deps: CommandPaletteDeps): (hit: SearchHit) => CommandPaletteRow {
    return (hit) => hitRow(hit, deps)
}

function toCommandGroup(
    commands: CommandPaletteCommand[],
    deps: CommandPaletteDeps,
): (label: readonly ["pages" | "actions", string]) => CommandPaletteGroup {
    return ([key, label]) => ({
        key,
        label,
        rows: commands.filter((command) => command.group === key).map(toCommandRow(deps)),
    })
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
