import { SearchInterface } from "@features/search/interface"
import { DocumentSection, SectionHeading } from "@pattern/section"

export function SearchQuerySection() {
    return (
        <DocumentSection aria-labelledby="search-input-heading">
            <SectionHeading id="search-input-heading">query</SectionHeading>
            <SearchInterface />
        </DocumentSection>
    )
}
