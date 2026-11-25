import type { SearchHit } from "@core/search/pagefind"
import { getCommandPaletteCommands, type CommandPaletteActionId } from "@features/command-palette/commands"
import { buildCommandPaletteGroups } from "@features/command-palette/create-palette"
import { describe, expect, it } from "vite-plus/test"

function makeDeps() {
    const navigated: string[] = []
    const external: string[] = []
    const actions: CommandPaletteActionId[] = []
    const calls = { closed: 0, navigated, external, actions }
    return {
        calls,
        deps: {
            close: () => {
                calls.closed += 1
            },
            navigate: (href: string) => {
                calls.navigated.push(href)
            },
            openExternal: (href: string) => {
                calls.external.push(href)
            },
            runAction: (id: CommandPaletteActionId) => {
                calls.actions.push(id)
            },
        },
    }
}

function findRow(label: string, hits: SearchHit[] = []) {
    const { deps, calls } = makeDeps()
    const groups = buildCommandPaletteGroups(getCommandPaletteCommands(), hits, deps)
    const row = groups.flatMap((group) => group.rows).find((candidate) => candidate.label === label)
    return { row, calls }
}

describe("palette rows", () => {
    it("navigates and closes for a route", () => {
        const { row, calls } = findRow("~/cv")
        row?.run()
        expect(calls.navigated).toEqual(["/cv"])
        expect(calls.closed).toBe(1)
    })

    it("opens externally and closes for a link", () => {
        const { row, calls } = findRow("github")
        row?.run()
        expect(calls.external).toEqual(["https://github.com/krake747"])
        expect(calls.closed).toBe(1)
    })

    it("dispatches an action without closing first", () => {
        const { row, calls } = findRow("copy email")
        row?.run()
        expect(calls.actions).toEqual(["copy-email"])
        expect(calls.closed).toBe(0)
    })

    it("navigates to a search hit", () => {
        const { row, calls } = findRow("Log entry", [
            { title: "Log entry", excerpt: "excerpt", href: "/logs/log-entry" },
        ])
        row?.run()
        expect(calls.navigated).toEqual(["/logs/log-entry"])
        expect(calls.closed).toBe(1)
    })

    it("carries the copied label only on the copy action", () => {
        const { deps } = makeDeps()
        const rows = buildCommandPaletteGroups(getCommandPaletteCommands(), [], deps).flatMap((group) => group.rows)
        expect(rows.find((row) => row.label === "copy email")?.flash).toEqual({
            kind: "flash",
            id: "copy-email",
            label: "email copied",
        })
        expect(rows.find((row) => row.label === "download cv")?.flash).toEqual({ kind: "none" })
    })

    it("exposes href only on navigation rows", () => {
        const { deps } = makeDeps()
        const rows = buildCommandPaletteGroups(
            getCommandPaletteCommands(),
            [{ title: "Log entry", excerpt: "excerpt", href: "/logs/log-entry" }],
            deps,
        ).flatMap((group) => group.rows)
        expect(rows.find((row) => row.label === "~/cv")?.href).toBe("/cv")
        expect(rows.find((row) => row.label === "Log entry")?.href).toBe("/logs/log-entry")
        expect(rows.find((row) => row.label === "copy email")?.href).toBeUndefined()
        expect(rows.find((row) => row.label === "github")?.href).toBeUndefined()
    })
})
