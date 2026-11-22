import { siteContent } from "@core/content/site-content"
import { site } from "@core/site/site-meta"
import { ProseShell } from "@pattern/prose-shell"
import { Seo } from "@pattern/seo"
import { Anchor } from "@ui/anchor"
import { ProseSection, ProseSectionBody } from "@ui/prose-section"
import { SectionHeading } from "@ui/section-heading"

export default function PrivacyRoute() {
    return (
        <ProseShell
            command="cat privacy.txt"
            title="Privacy"
            lede="This site collects as little as a website reasonably can. Here is exactly what happens when you visit."
        >
            <Seo
                title="Privacy"
                description="How kevinkraemer.com handles data: a static site with no analytics, no tracking, and no cookies; the only stored state is your theme preference in browser localStorage."
                path="/privacy"
            />
            <ProseSection aria-labelledby="privacy-collection-heading">
                <SectionHeading id="privacy-collection-heading">what is collected</SectionHeading>
                <ProseSectionBody>
                    <p>
                        Nothing by the site itself. There are no analytics scripts, no tracking pixels, no advertising,
                        no cookies, and no account system. Fonts are self-hosted, so your browser talks only to this
                        domain while you read.
                    </p>
                    <p>
                        The site is hosted on Netlify. Like any web host, it processes standard request logs (IP
                        address, requested URL, timestamp, user agent) to serve pages and protect against abuse. These
                        logs are under Netlify's control and are not used by this site for profiling or marketing.
                    </p>
                </ProseSectionBody>
            </ProseSection>
            <ProseSection aria-labelledby="privacy-localstorage-heading">
                <SectionHeading id="privacy-localstorage-heading">local storage</SectionHeading>
                <ProseSectionBody>
                    <p>
                        One display preference is saved in your browser's localStorage: the color theme (light or dark),
                        which controls how this site looks on your next visit.
                    </p>
                    <p>
                        This data never leaves your browser. It is not transmitted to any server, shared with anyone, or
                        readable by other sites. Clearing your browser's site data removes it entirely, and the site
                        falls back to its defaults.
                    </p>
                </ProseSectionBody>
            </ProseSection>
            <ProseSection aria-labelledby="privacy-contact-heading">
                <SectionHeading id="privacy-contact-heading">questions</SectionHeading>
                <ProseSectionBody>
                    <p>
                        If you email me, I use your address and message solely to reply to you. Nothing from the
                        correspondence is published or passed to third parties.
                    </p>
                    <p>
                        Questions about anything on this page can go to{" "}
                        <Anchor href={`mailto:${site.email}`} variant="prose" class="break-all">
                            {site.email}
                        </Anchor>
                        . Changes to this policy will be posted on this page.
                    </p>
                </ProseSectionBody>
            </ProseSection>
            <footer class="animate-fade-up pt-6">
                <p class="font-mono text-xs text-stone-600 dark:text-stone-400">
                    Last updated {siteContent.meta.buildDate} · For questions, see{" "}
                    <Anchor href="/contact" variant="prose">
                        contact
                    </Anchor>
                    .
                </p>
            </footer>
        </ProseShell>
    )
}
