import { siteContent } from "@core/content/site-content"
import { sitemapPaths } from "@core/site/prerender-paths"
import { xml } from "@core/site/respond"
import { origin } from "@core/site/urls"

const paths = sitemapPaths(siteContent)

export function GET(): Response {
    const urls = paths.map((path) => `<url><loc>${origin}${path}</loc></url>`).join("")
    return xml(
        [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">',
            urls,
            "</urlset>",
        ].join(""),
    )
}
