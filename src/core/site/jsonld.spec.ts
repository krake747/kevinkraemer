import {
    makeBlogSchema,
    makeBreadcrumbListSchema,
    makeHomepageBlogSchema,
    makeHomepageOrganizationSchema,
    makePersonSchema,
    makeProfilePageSchema,
    makeWebSiteSchema,
    toJsonLd,
} from "@core/site/jsonld"
import { site } from "@core/site/site-meta"
import { origin } from "@core/site/urls"
import * as v from "valibot"
import { describe, expect, it } from "vite-plus/test"

const text = () => v.pipe(v.string(), v.minLength(1))
const url = () => v.pipe(v.string(), v.url())

const dateTime = () => v.pipe(v.string(), v.isoTimestamp())
const positive = () =>
    v.pipe(
        v.number(),
        v.check((value) => value > 0),
    )
const positiveInt = () =>
    v.pipe(
        v.number(),
        v.integer(),
        v.check((value) => value > 0),
    )
const nonEmpty = <T extends v.GenericSchema>(schema: T) => v.pipe(v.array(schema), v.minLength(1))

const personSchema = v.object({
    context: v.literal("https://schema.org"),
    kind: v.literal("Person"),
    name: text(),
    url: url(),
    jobTitle: text(),
    sameAs: v.tuple([url(), url()]),
    description: text(),
    knowsAbout: nonEmpty(text()),
})

const imageObjectSchema = v.object({
    kind: v.literal("ImageObject"),
    url: url(),
    width: positive(),
    height: positive(),
})

const speakableSchema = v.object({
    kind: v.literal("SpeakableSpecification"),
    cssSelector: v.array(text()),
})

const organizationFields = {
    context: v.literal("https://schema.org"),
    kind: v.literal("Organization"),
    name: text(),
    url: url(),
    logo: v.object({
        kind: v.literal("ImageObject"),
        url: url(),
        width: v.optional(positive()),
        height: v.optional(positive()),
    }),
}

const organizationSchema = v.object(organizationFields)

const logEntrySchema = v.object({
    context: v.literal("https://schema.org"),
    kind: v.literal("BlogPosting"),
    headline: text(),
    description: text(),
    image: imageObjectSchema,
    url: url(),
    datePublished: dateTime(),
    dateModified: v.optional(dateTime()),
    keywords: v.optional(text()),
    author: v.object({
        kind: v.literal("Person"),
        name: text(),
        url: url(),
        jobTitle: text(),
        sameAs: v.tuple([url(), url()]),
    }),
    publisher: organizationSchema,
    speakable: speakableSchema,
})

const breadcrumbListSchema = v.object({
    context: v.literal("https://schema.org"),
    kind: v.literal("BreadcrumbList"),
    itemListElement: v.array(
        v.object({
            kind: v.literal("ListItem"),
            position: positiveInt(),
            name: text(),
            item: v.optional(url()),
        }),
    ),
})

const linkedPersonSchema = v.object({
    "@context": v.literal("https://schema.org"),
    "@type": v.literal("Person"),
    name: text(),
    url: url(),
    jobTitle: text(),
    sameAs: v.tuple([url(), url()]),
    description: text(),
    knowsAbout: nonEmpty(text()),
})

const webSiteSchema = v.object({
    context: v.literal("https://schema.org"),
    kind: v.literal("WebSite"),
    name: text(),
    url: url(),
    description: text(),
    inLanguage: v.literal("en"),
    keywords: text(),
})

const profilePageSchema = v.object({
    context: v.literal("https://schema.org"),
    kind: v.literal("ProfilePage"),
    name: text(),
    url: url(),
    description: text(),
    inLanguage: v.literal("en"),
    mainEntity: v.object({
        kind: v.literal("Person"),
        name: text(),
        url: url(),
        jobTitle: text(),
    }),
})

const logsHomepageSchema = v.object({
    context: v.literal("https://schema.org"),
    kind: v.literal("Blog"),
    name: text(),
    url: url(),
    description: text(),
    inLanguage: v.literal("en"),
    blogPost: nonEmpty(
        v.object({
            kind: v.literal("BlogPosting"),
            headline: text(),
            description: text(),
            url: url(),
            datePublished: dateTime(),
        }),
    ),
})

const homepageOrganizationSchema = v.object({
    ...organizationFields,
    contactPoint: v.object({
        kind: v.literal("ContactPoint"),
        contactType: text(),
        email: v.pipe(v.string(), v.email()),
    }),
    address: v.object({
        kind: v.literal("PostalAddress"),
        addressLocality: text(),
        addressCountry: v.pipe(v.string(), v.regex(/^[A-Z]{2}$/)),
    }),
    knowsAbout: nonEmpty(text()),
    makesOffer: v.object({
        kind: v.literal("Offer"),
        itemOffered: v.object({
            kind: v.literal("Service"),
            name: text(),
            serviceType: text(),
            description: text(),
        }),
    }),
})

describe("the person schema", () => {
    it("forwards the provided url and exposes required linked-data context", () => {
        const aboutUrl = `${origin}/about`
        const schema = makePersonSchema(aboutUrl)
        expect(schema["url"]).toBe(aboutUrl)
        expect(schema).toEqual(expect.schemaMatching(personSchema))
    })

    it("serializes to valid JSON-LD with @context and @type", () => {
        const schema = makePersonSchema(`${origin}/about`)
        expect(toJsonLd(schema)).toEqual(expect.schemaMatching(linkedPersonSchema))
    })

    it("names discoverable product terms in knowsAbout", () => {
        const schema = makePersonSchema(site.url)
        const terms = schema["knowsAbout"]
        expect(terms.length).toBeGreaterThan(0)
        for (const term of terms) {
            expect(site.keywords).toContain(term)
            expect(term.length).toBeGreaterThan(0)
        }
    })
})

describe("the Log Entry schema", () => {
    it("produces a valid BlogPosting that satisfies the consumer contract", () => {
        const schema = makeBlogSchema({
            headline: "Hello",
            description: "Desc",
            image: site.image,
            pageUrl: `${origin}/logs/hello`,
            published: "2026-01-01T00:00:00.000Z",
            author: site.name,
            tags: ["solid"],
        })
        expect(schema).toEqual(expect.schemaMatching(logEntrySchema))
    })

    it("includes dateModified and keywords only when present", () => {
        const without = makeBlogSchema({
            headline: "Hello",
            description: "Desc",
            image: site.image,
            pageUrl: `${origin}/logs/hello`,
            published: "2026-01-01T00:00:00.000Z",
            author: site.name,
        })
        expect(without).not.toHaveProperty("dateModified")
        expect(without).not.toHaveProperty("keywords")
        expect(without).toEqual(expect.schemaMatching(logEntrySchema))

        const withModified = makeBlogSchema({
            headline: "Hello",
            description: "Desc",
            image: site.image,
            pageUrl: `${origin}/logs/hello`,
            published: "2026-02-01T00:00:00.000Z",
            modified: "2026-02-01T00:00:00.000Z",
            author: site.name,
            tags: ["a", "b"],
        })
        expect(withModified).toHaveProperty("dateModified", "2026-02-01T00:00:00.000Z")
        expect(withModified).toHaveProperty("keywords", "a, b")
        expect(withModified).toEqual(expect.schemaMatching(logEntrySchema))
    })

    it("omits keywords for empty tags", () => {
        const schema = makeBlogSchema({
            headline: "Hello",
            description: "Desc",
            image: site.image,
            pageUrl: `${origin}/logs/hello`,
            published: "2026-01-01T00:00:00.000Z",
            author: site.name,
            tags: [],
        })
        expect(schema).not.toHaveProperty("keywords")
        expect(schema).toEqual(expect.schemaMatching(logEntrySchema))
    })
})

describe("the website schema", () => {
    it("exposes keywords and a canonical url for brand discovery", () => {
        const schema = makeWebSiteSchema()
        expect(schema).toEqual(expect.schemaMatching(webSiteSchema))
        expect(schema["url"]).toBe(site.url)
        expect(schema["keywords"]).toBe(site.keywords.join(", "))
    })
})

describe("the organization schema", () => {
    it("offers the main service with a serviceType graders can read", () => {
        const schema = makeHomepageOrganizationSchema()
        expect(schema).toEqual(expect.schemaMatching(homepageOrganizationSchema))
        const offered = schema.makesOffer.itemOffered
        expect(offered.name).toBe(offered.serviceType)
        expect(offered.name.length).toBeGreaterThan(0)
    })

    it("serializes offer and knowsAbout to JSON-LD", () => {
        const linked = toJsonLd(makeHomepageOrganizationSchema())
        expect(linked).toMatchObject({
            "@type": "Organization",
            makesOffer: {
                "@type": "Offer",
                itemOffered: { "@type": "Service" },
            },
        })
    })

    it("publishes the contact route and the base location for entity resolution", () => {
        const schema = makeHomepageOrganizationSchema()
        expect(schema.contactPoint.email).toBe(site.email)
        expect(schema.contactPoint.contactType.length).toBeGreaterThan(0)
        expect(schema.address.addressCountry).toBe("LU")
        expect(schema.address.addressLocality).toBe("Luxembourg")
        expect(toJsonLd(schema)).toMatchObject({
            contactPoint: { "@type": "ContactPoint", email: site.email },
            address: { "@type": "PostalAddress", addressCountry: "LU" },
        })
    })
})
describe("the profile page schema", () => {
    it("types the homepage as Kevin's profile page", () => {
        const schema = makeProfilePageSchema()
        expect(schema).toEqual(expect.schemaMatching(profilePageSchema))
        expect(schema["url"]).toBe(site.url)
        expect(schema.mainEntity.name).toBe(site.name)
    })
})

describe("the Logs homepage schema", () => {
    const entries = [
        {
            title: "Hello",
            description: "Desc",
            url: `${origin}/logs/hello`,
            datePublished: "2026-01-01T00:00:00.000Z",
        },
    ]

    it("lists exactly the entries the Logs section renders", () => {
        const schema = makeHomepageBlogSchema(entries)
        expect(schema).toEqual(expect.schemaMatching(logsHomepageSchema))
        expect(schema["url"]).toBe(`${origin}/logs`)
        expect(schema["blogPost"].length).toBe(entries.length)
    })

    it("serializes to JSON-LD Blog with BlogPosting entries", () => {
        const linked = toJsonLd(makeHomepageBlogSchema(entries))
        expect(linked).toMatchObject({
            "@type": "Blog",
            blogPost: [{ "@type": "BlogPosting" }],
        })
    })
})

describe("the breadcrumb schema", () => {
    it("assigns sequential positions and keeps item undefined when url missing", () => {
        const schema = makeBreadcrumbListSchema([{ name: "Home", url: site.url }, { name: "Logs" }])
        expect(schema).toHaveProperty("itemListElement", [
            { kind: "ListItem", position: 1, name: "Home", item: site.url },
            { kind: "ListItem", position: 2, name: "Logs" },
        ])
        expect(schema).toEqual(expect.schemaMatching(breadcrumbListSchema))
    })
})

describe("JSON-LD serialization", () => {
    it("maps kind and context to @type and @context recursively", () => {
        const input = {
            context: "https://schema.org",
            kind: "BlogPosting",
            nested: { kind: "Person", name: "A" },
            list: [{ kind: "ListItem", position: 1 }],
        }
        expect(toJsonLd(input)).toEqual({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            nested: { "@type": "Person", name: "A" },
            list: [{ "@type": "ListItem", position: 1 }],
        })
    })

    it("leaves non-kind keys untouched and handles null", () => {
        expect(toJsonLd(null)).toBeNull()
        expect(toJsonLd({ headline: "Hi", kind: "X" })).toEqual({ headline: "Hi", "@type": "X" })
    })
})
