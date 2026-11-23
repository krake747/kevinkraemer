import { sortByDateDesc } from "@core/content/model"
import { siteContent } from "@core/content/site-content"
import { escapeXml, xml } from "@core/site/respond"
import { buildTitle } from "@core/site/seo"
import { site } from "@core/site/site-meta"
import { origin } from "@core/site/urls"

function item(entry: (typeof siteContent.logs)[number]): string {
    const link = `${origin}/logs/${entry.id}`
    const categories = entry.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("")
    return `<item><title>${escapeXml(entry.title)}</title><link>${link}</link><guid isPermaLink="true">${link}</guid><description>${escapeXml(entry.description)}</description><pubDate>${new Date(entry.date).toUTCString()}</pubDate>${categories}<author>${escapeXml(site.name)}</author></item>`
}

export function GET(): Response {
    const siteUrl = `${origin}/`
    const items = sortByDateDesc(siteContent.logs).map(item).join("")
    return xml(
        `<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet href="/rss.css"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${escapeXml(buildTitle("Logs"))}</title><description>${escapeXml(site.feed.description)}</description><link>${siteUrl}</link><language>en-us</language><ttl>60</ttl><atom:link href="${siteUrl}rss.xml" rel="self" type="application/rss+xml"/>${items}</channel></rss>`,
    )
}
