import { SearchInterface } from "@features/search/interface"
import { DocumentSection } from "@pattern/document-section"
import { SectionHeading } from "@pattern/section-heading"

export function SearchQuerySection() {
    return (
        <DocumentSection aria-labelledby="search-input-heading">
            <SectionHeading id="search-input-heading">query</SectionHeading>
            <SearchInterface />
        </DocumentSection>
    )
}
