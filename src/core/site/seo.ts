import { site } from "@core/site/site-meta"

export type ContentType = "website" | "article"

export const seoDefaults: {
    title: string
    description: string
    image: string
    type: ContentType
    author: string
} = {
    title: site.name,
    description: "Kevin Kraemer's personal website",
    image: site.image,
    type: "website",
    author: site.name,
}

export function buildTitle(title: string) {
    return title.includes(site.name) ? title : `${title} · ${site.name}`
}
