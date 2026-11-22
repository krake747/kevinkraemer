import { SearchPage } from "@features/search/page"
import { ProseShell } from "@pattern/prose-shell"
import { Seo } from "@pattern/seo"
import { Anchor } from "@ui/anchor"
import { SectionHeading } from "@ui/section-heading"

export default function SearchRoute() {
    return (
        <ProseShell
            command="grep -r"
            title="Search"
            lede="Find anything across the site — logs, CV, and docs. Results update as you type."
        >
            <Seo
                title="Search"
                description="Search through all articles and content on kevinkraemer.com"
                path="/search"
                robots="noindex"
            />
            <section aria-labelledby="search-input-heading" class="animate-fade-up">
                <SectionHeading id="search-input-heading">query</SectionHeading>
                <SearchPage />
            </section>
            <footer class="pt-6">
                <noscript>
                    <p class="font-mono text-xs text-stone-600 dark:text-stone-400">
                        Search needs JavaScript. Browse{" "}
                        <Anchor href="/logs" variant="prose">
                            logs
                        </Anchor>
                        ,{" "}
                        <Anchor href="/cv" variant="prose">
                            cv
                        </Anchor>
                        , or{" "}
                        <Anchor href="/sitemap-index.xml" variant="prose">
                            sitemap
                        </Anchor>{" "}
                        instead.
                    </p>
                </noscript>
            </footer>
        </ProseShell>
    )
}
