import { site } from "@core/site/site-meta"
import { CV_PDF_PATH } from "@core/site/urls"
import type { CommandPaletteActionId } from "@features/command-palette/commands"

type CommandPaletteActionDeps = {
    scheme: "light" | "dark"
    setScheme: (scheme: "light" | "dark") => void
    flash: (id: CommandPaletteActionId) => void
    close: () => void
}

function triggerDownload(href: string, filename: string): void {
    const link = document.createElement("a")
    link.href = href
    link.download = filename
    link.click()
}

function copyEmail(deps: CommandPaletteActionDeps): void {
    navigator.clipboard
        .writeText(site.email)
        .then(() => {
            deps.flash("copy-email")
        })
        .catch(() => {
            window.location.assign(`mailto:${site.email}`)
        })
}

const actionHandlers: Record<CommandPaletteActionId, (deps: CommandPaletteActionDeps) => void> = {
    "toggle-theme": (deps) => {
        deps.setScheme(deps.scheme === "dark" ? "light" : "dark")
        deps.close()
    },
    "download-cv": (deps) => {
        triggerDownload(CV_PDF_PATH, "kevinkraemer-cv.pdf")
        deps.close()
    },
    "copy-email": copyEmail,
}

export function runCommandPaletteAction(id: CommandPaletteActionId, deps: CommandPaletteActionDeps): void {
    actionHandlers[id](deps)
}
