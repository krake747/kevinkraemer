import { DocumentSection, DocumentSectionBody } from "@pattern/document-section"
import { SectionHeading } from "@ui/section-heading"

export function AboutOutside() {
    return (
        <DocumentSection aria-labelledby="about-outside-heading">
            <SectionHeading id="about-outside-heading">outside work</SectionHeading>
            <DocumentSectionBody as="p">
                Road or gravel bike when the weather allows, and working through the local food scene with friends. I'm
                modeling finance domain logic in OCaml, with a bit of Rust on the side, and I still follow the markets I
                no longer have to hedge.
            </DocumentSectionBody>
        </DocumentSection>
    )
}
