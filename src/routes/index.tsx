import { getRecentLogEntries } from "@core/content/model"
import { siteContent } from "@core/content/site-content"
import {
    makeHomepageBlogSchema,
    makeHomepageOrganizationSchema,
    makeProfilePageSchema,
    makeWebSiteSchema,
    toJsonLd,
} from "@core/site/jsonld"
import { canonicalFor } from "@core/site/urls"
import { HomeAbout } from "@features/home/about"
import { HomeContact } from "@features/home/contact"
import { HomeHero } from "@features/home/hero"
import { HomeLogs } from "@features/home/logs"
import { LogSubscribe } from "@features/log/subscribe"
import { Seo } from "@pattern/seo"
import { Script } from "@solidjs/meta"
import { defineFileRoute } from "@solidjs/router/fs"
import { For } from "solid-js"

const SECTION_LINKS = [
    { label: "#story", href: "/#story" },
    { label: "#logs", href: "/#logs" },
    { label: "#contact", href: "/#contact" },
] as const

export const route = defineFileRoute("/", { info: { sections: [...SECTION_LINKS] } })

const RECENT_LOG_COUNT = 3

export default function HomeRoute() {
    const recentLogs = getRecentLogEntries(siteContent.logs, RECENT_LOG_COUNT)
    const homepageSchemas = [
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
            />
            <For each={homepageSchemas}>
                {(schema) => <Script type="application/ld+json">{JSON.stringify(toJsonLd(schema))}</Script>}
            </For>
            <HomeHero />
            <HomeAbout id="story" />
            <HomeLogs entries={recentLogs} id="logs">
                <LogSubscribe />
            </HomeLogs>
            <HomeContact id="contact" />
        </div>
    )
}
