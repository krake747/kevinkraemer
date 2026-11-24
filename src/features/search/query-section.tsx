import { SearchInterface } from "@features/search/interface"
import { DocumentSection } from "@pattern/document-section"

export function SearchQuerySection() {
    return (
        <DocumentSection id="search-input-heading" title="query">
            <SearchInterface />
        </DocumentSection>
    )
}
