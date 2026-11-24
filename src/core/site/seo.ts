import { site } from "@core/site/site-meta"

export const seoDefaults = {
    image: site.image,
    author: site.name,
}

export function buildTitle(title: string) {
    return title.includes(site.name) ? title : `${title} · ${site.name}`
}
