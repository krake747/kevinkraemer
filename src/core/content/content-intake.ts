import * as v from "valibot"

export const CONTENT_BUNDLE_VERSION = 1

export const LogEntrySchema = v.object({
    title: v.pipe(v.string(), v.minLength(1), v.maxLength(100)),
    description: v.pipe(v.string(), v.minLength(10), v.maxLength(200)),
    date: v.pipe(
        v.string(),
        v.minLength(1),
        v.check((value) => !Number.isNaN(Date.parse(value)), "date must parse to a timestamp"),
    ),
    tags: v.optional(v.array(v.string()), []),
})

export const AboutSchema = v.object({
    title: v.pipe(v.string(), v.minLength(1), v.maxLength(50)),
    order: v.pipe(v.number(), v.integer()),
})

export const ExperienceSchema = v.object({
    company: v.pipe(v.string(), v.minLength(1), v.maxLength(100)),
    role: v.pipe(v.string(), v.minLength(1), v.maxLength(100)),
    location: v.pipe(v.string(), v.minLength(1), v.maxLength(100)),
    startDate: v.pipe(v.string(), v.minLength(1), v.maxLength(50)),
    endDate: v.nullable(v.pipe(v.string(), v.minLength(1), v.maxLength(50))),
    order: v.pipe(v.number(), v.integer()),
    responsibilities: v.array(v.pipe(v.string(), v.minLength(1))),
})

const UsesItemSchema = v.object({
    name: v.pipe(v.string(), v.minLength(1), v.maxLength(100)),
    href: v.optional(v.pipe(v.string(), v.url())),
    note: v.pipe(v.string(), v.minLength(1), v.maxLength(300)),
    ariaLabel: v.optional(v.pipe(v.string(), v.minLength(1), v.maxLength(200))),
})

export const UsesSchema = v.object({
    label: v.pipe(v.string(), v.minLength(1), v.maxLength(50)),
    order: v.pipe(v.number(), v.integer()),
    groups: v.array(
        v.object({
            label: v.pipe(v.string(), v.minLength(1), v.maxLength(50)),
            note: v.optional(v.pipe(v.string(), v.minLength(1), v.maxLength(300))),
            layout: v.optional(v.picklist(["rows", "daily", "hardware", "plain"]), "rows"),
            items: v.array(UsesItemSchema),
        }),
    ),
})

export const ProjectSchema = v.object({
    name: v.pipe(v.string(), v.minLength(1), v.maxLength(100)),
    tagline: v.pipe(v.string(), v.minLength(1), v.maxLength(300)),
    category: v.optional(v.picklist(["site", "tool", "service"])),
    featured: v.optional(v.boolean(), false),
    status: v.pipe(v.string(), v.minLength(1), v.maxLength(50)),
    year: v.optional(v.pipe(v.number(), v.integer())),
    stack: v.array(v.pipe(v.string(), v.minLength(1))),
    role: v.pipe(v.string(), v.minLength(1), v.maxLength(200)),
    liveUrl: v.optional(v.pipe(v.string(), v.url())),
    repoUrl: v.optional(v.pipe(v.string(), v.url())),
    figure: v.optional(
        v.union([
            v.object({
                value: v.pipe(v.string(), v.minLength(1), v.maxLength(20)),
                label: v.pipe(v.string(), v.minLength(1), v.maxLength(60)),
                source: v.optional(v.literal("manual")),
            }),
            v.object({
                label: v.pipe(v.string(), v.minLength(1), v.maxLength(60)),
                source: v.literal("prerender-routes"),
            }),
        ]),
    ),
    order: v.pipe(v.number(), v.integer()),
    problem: v.pipe(v.string(), v.minLength(1)),
    decisions: v.array(
        v.object({
            title: v.pipe(v.string(), v.minLength(1)),
            reason: v.pipe(v.string(), v.minLength(1)),
        }),
    ),
    implementation: v.optional(v.pipe(v.string(), v.minLength(1))),
    evidence: v.optional(
        v.array(
            v.object({
                caption: v.pipe(v.string(), v.minLength(1)),
            }),
        ),
        [],
    ),
    tradeoffs: v.optional(
        v.array(
            v.object({
                title: v.pipe(v.string(), v.minLength(1)),
                reason: v.pipe(v.string(), v.minLength(1)),
            }),
        ),
        [],
    ),
})
