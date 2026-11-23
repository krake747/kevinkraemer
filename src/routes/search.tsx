import { SearchNoScript } from "@features/search/no-script"
import { SearchQuerySection } from "@features/search/query-section"
import { ProseShell } from "@pattern/prose-shell"
import { Seo } from "@pattern/seo"

export default function SearchRoute() {
    return (
        <ProseShell
            command="grep -r"
            title="Search"
            lede="Find anything across the site: logs, CV, and docs. Results update as you type."
        >
            <Seo
                title="Search"
                description="Search through all articles and content on kevinkraemer.com"
                path="/search"
                robots="noindex"
            />
            <SearchQuerySection />
            <SearchNoScript />
        </ProseShell>
    )
}
