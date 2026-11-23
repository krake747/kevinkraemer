import { HOMEPAGE_RECENT_LOG_COUNT, getRecentLogEntries } from "@core/content/model"
import { siteContent } from "@core/content/site-content"
import {
    makeHomepageBlogSchema,
    makeHomepageOrganizationSchema,
    makeProfilePageSchema,
    makeWebSiteSchema,
} from "@core/site/jsonld"
import { site } from "@core/site/site-meta"
import { canonicalFor } from "@core/site/urls"
import { HomeAbout } from "@features/home/about"
import { HomeContact } from "@features/home/contact"
import { HomeHero } from "@features/home/hero"
import { HomeLogs } from "@features/home/logs"
import { LogSubscribe } from "@features/log/subscribe"
import { Seo } from "@pattern/seo"

export default function HomeRoute() {
    const recentLogs = getRecentLogEntries(siteContent.logs, HOMEPAGE_RECENT_LOG_COUNT)
    const extraSchemas = [
        makeProfilePageSchema(),
        makeWebSiteSchema(),
        makeHomepageOrganizationSchema(),
        makeHomepageBlogSchema(
            recentLogs.map((entry) => ({
                title: entry.title,
                description: entry.description,
                url: canonicalFor(`/logs/${entry.id}`),
                datePublished: entry.date,
            })),
        ),
    ]

    return (
        <div class="flex-1">
            <Seo
                title="Full-stack developer"
                description="Full-stack developer and former financial risk analyst based in Luxembourg. I automate the boring parts first, then sweat the details everyone feels but nobody can name."
                path="/"
                keywords={site.keywords.join(", ")}
                extraSchemas={extraSchemas}
            />
            <HomeHero />
            <HomeAbout />
            <HomeLogs entries={recentLogs}>
                <LogSubscribe />
            </HomeLogs>
            <HomeContact />
        </div>
    )
}
