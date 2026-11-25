import { SearchNoScript } from "@features/search/no-script"
import { SearchQuerySection } from "@features/search/query-section"
import { DocumentPage, PageHeaderTitle } from "@pattern/page"
import { Seo } from "@pattern/seo"
import { TerminalCommandHeader } from "@pattern/terminal"
import { Meta } from "@solidjs/meta"

export default function SearchRoute() {
    return (
        <DocumentPage>
            <header class="animate-rise">
                <TerminalCommandHeader command="grep -r" class="mb-4" />
                <PageHeaderTitle>Search</PageHeaderTitle>
            </header>
            <Seo
                title="Search"
                description="Search through all log entries and content on kevinkraemer.com"
                path="/search"
            />
            <Meta name="robots" content="noindex, nofollow" />
            <SearchQuerySection />
            <SearchNoScript />
        </DocumentPage>
    )
}
