import { getCommandPaletteCommands, matchCommandPaletteCommands } from "@features/command-palette/commands"
import { describe, expect, it } from "vite-plus/test"

describe("command palette", () => {
    it("returns the full registry for an empty query", () => {
        const commands = getCommandPaletteCommands()
        expect(matchCommandPaletteCommands("", commands)).toEqual(commands)
        expect(commands.length).toBeGreaterThan(0)
    })

    it("reaches the cv route from the palette", () => {
        const commands = getCommandPaletteCommands()
        const matches = matchCommandPaletteCommands("cv", commands)
        expect(matches[0]).toMatchObject({ kind: "route", href: "/cv" })
    })

    it("matches by keyword when the label does not contain the query", () => {
        const commands = getCommandPaletteCommands()
        const matches = matchCommandPaletteCommands("pdf", commands)
        expect(matches.some((command) => command.kind === "action" && command.id === "download-cv")).toBe(true)
    })

    it("is case-insensitive", () => {
        const commands = getCommandPaletteCommands()
        expect(matchCommandPaletteCommands("PORTFOLIO", commands)[0]?.label).toBe("~/portfolio")
    })

    it("returns nothing when no command matches", () => {
        const commands = getCommandPaletteCommands()
        expect(matchCommandPaletteCommands("zzz-nothing", commands)).toEqual([])
    })

    it("routes to every trust page", () => {
        const commands = getCommandPaletteCommands()
        for (const href of ["/about", "/contact", "/privacy"]) {
            expect(commands.some((command) => command.kind === "route" && command.href === href)).toBe(true)
        }
        const privacyMatch = matchCommandPaletteCommands("privacy", getCommandPaletteCommands())[0]
        expect(privacyMatch).toMatchObject({ kind: "route", href: "/privacy" })
    })

    it("routes to the projects register by label or keywords", () => {
        const commands = getCommandPaletteCommands()
        expect(commands.some((command) => command.kind === "route" && command.href === "/projects")).toBe(true)
        expect(
            matchCommandPaletteCommands("projects", commands).some(
                (command) => command.kind === "route" && command.href === "/projects",
            ),
        ).toBe(true)
        expect(matchCommandPaletteCommands("case", commands)[0]?.label).toBe("~/projects")
    })

    it("routes to the developer docs by label or agent keywords", () => {
        const commands = getCommandPaletteCommands()
        expect(commands.some((command) => command.kind === "route" && command.href === "/developers")).toBe(true)
        expect(matchCommandPaletteCommands("openapi", commands)[0]?.label).toBe("~/developers")
        expect(matchCommandPaletteCommands("agents", commands)[0]?.label).toBe("~/developers")
    })

    it("trims surrounding whitespace from the query", () => {
        const commands = getCommandPaletteCommands()
        expect(matchCommandPaletteCommands("  PORTFOLIO  ", commands)[0]?.label).toBe("~/portfolio")
    })

    it("prefers label matches over keyword matches", () => {
        const custom = [
            {
                kind: "route" as const,
                label: "alpha",
                href: "/a",
                group: "pages" as const,
                keywords: ["beta"],
                icon: null,
            },
            { kind: "route" as const, label: "beta", href: "/b", group: "pages" as const, icon: null },
        ]

        expect(matchCommandPaletteCommands("beta", custom).map((c) => c.label)).toEqual(["beta", "alpha"])
    })

    it("matches case-insensitively across label and keywords", () => {
        const cmd = {
            kind: "route" as const,
            label: "Foo BAR",
            href: "/x",
            group: "pages" as const,
            keywords: ["BAZ"],
            icon: null,
        }
        expect(matchCommandPaletteCommands("foo bar baz", [cmd])).toHaveLength(1)
        expect(matchCommandPaletteCommands("FOO", [cmd])).toHaveLength(1)
        expect(matchCommandPaletteCommands("baz", [cmd])).toHaveLength(1)
        expect(matchCommandPaletteCommands("qux", [cmd])).toHaveLength(0)
    })
})
