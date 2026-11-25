import { DocumentSection, DocumentSectionBody } from "@pattern/document-section"

export function AboutOutside() {
    return (
        <DocumentSection id="about-outside-heading" title="outside work">
            <DocumentSectionBody as="p">
                Road or gravel bike when the weather allows, and working through the local food scene with friends. I'm
                modeling finance domain logic in OCaml, with a bit of Rust on the side, and I still follow the markets I
                no longer have to hedge.
            </DocumentSectionBody>
        </DocumentSection>
    )
}
