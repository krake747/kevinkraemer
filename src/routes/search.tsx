import { SearchNoScript } from "@features/search/no-script"
import { SearchQuerySection } from "@features/search/query-section"
import { DocumentPage, PageHeader, PageHeaderTitle } from "@pattern/page"
import { NoIndex, Seo } from "@pattern/seo"
import { TerminalCommandHeader } from "@pattern/terminal"

export default function SearchRoute() {
    return (
        <DocumentPage>
            <PageHeader class="animate-rise">
                <TerminalCommandHeader command="grep -r" class="mb-4" />
                <PageHeaderTitle>Search</PageHeaderTitle>
            </PageHeader>
            <Seo
                title="Search"
                description="Search through all log entries and content on kevinkraemer.com"
                path="/search"
            />
            <NoIndex />
            <SearchQuerySection />
            <SearchNoScript />
        </DocumentPage>
    )
}
