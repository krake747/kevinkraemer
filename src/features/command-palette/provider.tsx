import { applyWithoutTransitions, colorScheme } from "@core/theme"
import { runCommandPaletteAction } from "@features/command-palette/actions"
import type { CommandPaletteActionId } from "@features/command-palette/commands"
import { createCommandPalette, type CommandPaletteGroup } from "@features/command-palette/create-palette"
import { CONFIRM_RESET_MS } from "@pattern/create-copy-feedback"
import { useNavigate } from "@solidjs/router"
import { createContext, createSignal, onSettled, useContext, type Accessor, type ParentProps } from "solid-js"

type CommandPaletteValue = {
    state: {
        input: Accessor<string>
        groups: Accessor<CommandPaletteGroup[]>
        isLoading: Accessor<boolean>
        flashedAction: Accessor<CommandPaletteActionId | null>
    }
    actions: {
        update: (value: string) => void
        run: (rowId: string) => void
        reset: () => void
    }
}

const CommandPaletteContext = createContext<CommandPaletteValue>(undefined, { name: "CommandPalette" })

export function CommandPaletteProvider(props: ParentProps<{ close: () => void }>) {
    const navigate = useNavigate()
    const close = () => props.close()
    const [flashedAction, setFlashedAction] = createSignal<CommandPaletteActionId | null>(null)
    let flashTimer: ReturnType<typeof setTimeout> | undefined
    onSettled(() => () => clearTimeout(flashTimer))

    const flash = (id: CommandPaletteActionId) => {
        setFlashedAction(id)
        clearTimeout(flashTimer)
        flashTimer = setTimeout(() => setFlashedAction(null), CONFIRM_RESET_MS)
    }

    const palette = createCommandPalette({
        close,
        navigate: (href) => navigate(href),
        openExternal: (href) => window.open(href, "_blank", "noopener,noreferrer"),
        runAction: (id) =>
            runCommandPaletteAction(id, {
                scheme: colorScheme.get().resolved === "dark" ? "dark" : "light",
                setScheme: (scheme) => applyWithoutTransitions(() => colorScheme.set(scheme)),
                flash,
                close,
            }),
    })

    const value: CommandPaletteValue = {
        state: { input: palette.input, groups: palette.groups, isLoading: palette.isLoading, flashedAction },
        actions: { update: palette.update, run: palette.run, reset: palette.reset },
    }

    return <CommandPaletteContext value={value}>{props.children}</CommandPaletteContext>
}

export function useCommandPalette() {
    return useContext(CommandPaletteContext)
}
