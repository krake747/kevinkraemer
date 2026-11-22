import { xml } from "@core/site/respond"
import { origin } from "@core/site/urls"

export function GET(): Response {
    return xml(
        [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
            `<sitemap><loc>${origin}/sitemap-0.xml</loc></sitemap>`,
            "</sitemapindex>",
        ].join(""),
    )
}
