import { site } from "@core/site/site-meta"

export const seoDefaults: {
    title: string
    description: string
    image: string
    author: string
} = {
    title: site.name,
    description: "Kevin Kraemer's personal website",
    image: site.image,
    author: site.name,
}

export function buildTitle(title: string) {
    return title.includes(site.name) ? title : `${title} · ${site.name}`
}
