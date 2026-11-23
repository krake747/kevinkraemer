import { SearchInterface } from "@features/search/interface"
import { SectionHeading } from "@ui/section-heading"

export function SearchQuerySection() {
    return (
        <section aria-labelledby="search-input-heading" class="animate-fade-up">
            <SectionHeading id="search-input-heading">query</SectionHeading>
            <SearchInterface />
        </section>
    )
}
