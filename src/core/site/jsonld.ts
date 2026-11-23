import { site } from "@core/site/site-meta"
import { origin } from "@core/site/urls"

const PERSON_BIO = "Full-stack developer and former financial risk analyst based in Luxembourg"
const JOB_TITLE = "Full-stack Developer"
const PERSON_KNOWS_ABOUT = [...site.keywords].slice(1)

export function makePersonSchema(personUrl: string, knowsAbout: string[] = PERSON_KNOWS_ABOUT) {
    return {
        context: "https://schema.org",
        kind: "Person",
        name: site.name,
        url: personUrl,
        jobTitle: JOB_TITLE,
        sameAs: [site.socials.github, site.socials.linkedin],
        description: PERSON_BIO,
        knowsAbout,
    }
}

function makeOrganizationSchema() {
    return {
        context: "https://schema.org",
        kind: "Organization",
        name: site.organization.name,
        url: site.organization.url,
        logo: {
            kind: "ImageObject",
            url: site.organization.logo,
        },
        contactPoint: {
            kind: "ContactPoint",
            contactType: site.contactType,
            email: site.email,
        },
        address: {
            kind: "PostalAddress",
            addressLocality: site.address.locality,
            addressCountry: site.address.country,
        },
    }
}

export function makeHomepageOrganizationSchema() {
    return {
        ...makeOrganizationSchema(),
        knowsAbout: PERSON_KNOWS_ABOUT,
        makesOffer: {
            kind: "Offer",
            itemOffered: {
                kind: "Service",
                name: "Full-stack development",
                serviceType: "Full-stack development",
                description:
                    "Design and engineering of web applications with TypeScript, React, SolidJS, and Tailwind CSS.",
                provider: {
                    kind: "Person",
                    name: site.name,
                    url: site.url,
                },
                areaServed: "Luxembourg",
                url: site.url,
            },
        },
    }
}

export function makeWebSiteSchema() {
    return {
        context: "https://schema.org",
        kind: "WebSite",
        name: site.name,
        url: site.url,
        description: PERSON_BIO,
        inLanguage: "en",
        keywords: site.keywords.join(", "),
    }
}

export function makeProfilePageSchema() {
    return {
        context: "https://schema.org",
        kind: "ProfilePage",
        name: `${site.name} · Full-stack developer`,
        url: site.url,
        description: PERSON_BIO,
        inLanguage: "en",
        mainEntity: {
            kind: "Person",
            name: site.name,
            url: site.url,
            jobTitle: JOB_TITLE,
        },
    }
}

type HomepageBlogEntry = {
    title: string
    description: string
    url: string
    datePublished: string
}

export function makeHomepageBlogSchema(entries: HomepageBlogEntry[]) {
    return {
        context: "https://schema.org",
        kind: "Blog",
        name: "Logs",
        url: `${origin}/logs`,
        description: "Thoughts on software architecture, type systems, and finance applied to engineering.",
        inLanguage: "en",
        blogPost: entries.map((entry) => ({
            kind: "BlogPosting",
            headline: entry.title,
            description: entry.description,
            url: entry.url,
            datePublished: entry.datePublished,
        })),
    }
}

export type JsonLd = string | number | boolean | null | JsonLd[] | { [key: string]: JsonLd }

export function makeBlogSchema(input: {
    headline: string
    description: string
    image: string
    pageUrl: string
    published: string
    modified?: string
    author: string
    tags?: string[]
}): JsonLd {
    return {
        context: "https://schema.org",
        kind: "BlogPosting",
        headline: input.headline,
        description: input.description,
        image: {
            kind: "ImageObject",
            url: input.image,
            width: site.imageDimensions.width,
            height: site.imageDimensions.height,
        },
        url: input.pageUrl,
        datePublished: input.published,
        ...(input.modified !== undefined ? { dateModified: input.modified } : {}),
        author: {
            kind: "Person",
            name: input.author,
            url: site.url,
            jobTitle: JOB_TITLE,
            sameAs: [site.socials.github, site.socials.linkedin],
        },
        publisher: makeOrganizationSchema(),
        speakable: {
            kind: "SpeakableSpecification",
            cssSelector: ["h1", "[data-speakable]"],
        },
        ...(input.tags !== undefined && input.tags.length > 0 ? { keywords: input.tags.join(", ") } : {}),
    }
}

export function makeBreadcrumbListSchema(items: { name: string; url?: string }[]): JsonLd {
    return {
        context: "https://schema.org",
        kind: "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            kind: "ListItem",
            position: index + 1,
            name: item.name,
            ...(item.url !== undefined ? { item: item.url } : {}),
        })),
    }
}

const JSONLD_KEY_MAP: Record<string, string> = { kind: "@type", context: "@context" }

function mapJsonLdKey(key: string): string {
    return JSONLD_KEY_MAP[key] ?? key
}

function toJsonLdObject(value: { [key: string]: JsonLd }): JsonLd {
    return Object.fromEntries(Object.entries(value).map(([key, val]) => [mapJsonLdKey(key), toJsonLd(val)]))
}

function isJsonLdObject(value: JsonLd): value is { [key: string]: JsonLd } {
    return value !== null && typeof value === "object" && !Array.isArray(value)
}

export function toJsonLd(value: JsonLd): JsonLd {
    if (Array.isArray(value)) {
        return value.map((entry) => toJsonLd(entry))
    }
    return isJsonLdObject(value) ? toJsonLdObject(value) : value
}
