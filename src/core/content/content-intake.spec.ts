import {
    AboutSchema,
    CONTENT_BUNDLE_VERSION,
    ExperienceSchema,
    LogEntrySchema,
    ProjectSchema,
    UsesSchema,
} from "@core/content/content-intake"
import * as v from "valibot"
import { describe, expect, it } from "vite-plus/test"

describe("log intake", () => {
    it("accepts a minimal entry", () => {
        expect(
            v.safeParse(LogEntrySchema, {
                title: "Something visible",
                description: "A note about what stays hidden.",
                date: "2026-08-23",
            }).success,
        ).toBe(true)
    })

    it("rejects an empty title and an unparseable date", () => {
        expect(
            v.safeParse(LogEntrySchema, { title: "", description: "Long enough.", date: "2026-08-23" }).success,
        ).toBe(false)
        expect(
            v.safeParse(LogEntrySchema, { title: "Ok", description: "Long enough.", date: "not-a-date" }).success,
        ).toBe(false)
    })
})

describe("about intake", () => {
    it("accepts a section header", () => {
        expect(v.safeParse(AboutSchema, { title: "Story", order: 1 }).success).toBe(true)
    })
})

describe("experience intake", () => {
    it("accepts a current role with a null end date", () => {
        expect(
            v.safeParse(ExperienceSchema, {
                company: "Acme",
                role: "Engineer",
                location: "Luxembourg",
                startDate: "2020",
                endDate: null,
                order: 1,
                responsibilities: ["Ship things."],
            }).success,
        ).toBe(true)
    })
})

describe("uses intake", () => {
    it("defaults the group layout to rows", () => {
        const parsed = v.safeParse(UsesSchema, {
            label: "Tools",
            order: 1,
            groups: [{ label: "Editors", items: [{ name: "Zed", note: "Fast." }] }],
        })
        expect(parsed.success).toBe(true)
        expect(parsed.success ? parsed.output.groups[0]?.layout : undefined).toBe("rows")
    })

    it("rejects an unknown layout", () => {
        expect(
            v.safeParse(UsesSchema, {
                label: "Tools",
                order: 1,
                groups: [{ label: "Editors", layout: "grid", items: [] }],
            }).success,
        ).toBe(false)
    })
})

describe("project intake", () => {
    it("accepts a manual figure and a prerender-routes figure", () => {
        const base = {
            name: "Site",
            tagline: "A portfolio.",
            status: "Live",
            stack: ["Solid"],
            role: "Owner",
            order: 1,
            problem: "Stand out.",
            decisions: [],
        }
        expect(
            v.safeParse(ProjectSchema, {
                ...base,
                figure: { value: "16 routes", label: "prerendered", source: "manual" },
            }).success,
        ).toBe(true)
        expect(
            v.safeParse(ProjectSchema, {
                ...base,
                figure: { label: "routes prerendered", source: "prerender-routes" },
            }).success,
        ).toBe(true)
    })
})

describe("bundle version", () => {
    it("starts at one", () => {
        expect(CONTENT_BUNDLE_VERSION).toBe(1)
    })
})
