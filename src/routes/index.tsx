import { HOMEPAGE_RECENT_LOG_COUNT, getRecentLogEntries } from "@core/content/model"
import { siteContent } from "@core/content/site-content"
import {
    makeHomepageBlogSchema,
    makeHomepageOrganizationSchema,
    makeProfilePageSchema,
    makeWebSiteSchema,
} from "@core/site/jsonld"
import { canonicalFor } from "@core/site/urls"
import { HomeAbout } from "@features/home/about"
import { HomeContact } from "@features/home/contact"
import { HomeHero } from "@features/home/hero"
import { HomeLogs } from "@features/home/logs"
import { LogSubscribe } from "@features/log/subscribe"
import { PageSections, type SectionLink } from "@pattern/section-nav"
import { Seo } from "@pattern/seo"

const SECTION_LINKS: SectionLink[] = [
    { label: "#story", href: "/#story" },
    { label: "#logs", href: "/#logs" },
    { label: "#contact", href: "/#contact" },
]

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
                extraSchemas={extraSchemas}
            />
            <PageSections links={SECTION_LINKS} />
            <HomeHero />
            <HomeAbout id="story" />
            <HomeLogs entries={recentLogs} id="logs">
                <LogSubscribe />
            </HomeLogs>
            <HomeContact id="contact" />
        </div>
    )
}
