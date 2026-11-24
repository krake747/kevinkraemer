import { SearchNoScript } from "@features/search/no-script"
import { SearchQuerySection } from "@features/search/query-section"
import { DocumentPage } from "@pattern/document-page"
import { NoIndex, Seo } from "@pattern/seo"

export default function SearchRoute() {
    return (
        <DocumentPage
            command="grep -r"
            title="Search"
            lede="Find anything across the site: logs, CV, and docs. Results update as you type."
        >
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
