import { DocumentSection, DocumentSectionBody } from "@pattern/document-section"
import { SectionHeading } from "@pattern/section-heading"

export function AboutWork() {
    return (
        <DocumentSection aria-labelledby="about-work-heading">
            <SectionHeading id="about-work-heading">how i work</SectionHeading>
            <DocumentSectionBody render={(renderProps) => <p {...renderProps} />}>
                Finance still shapes how I work. Decisions happen with partial information and a tradeoff. Building
                software is mostly the same. Behavioral finance at university taught me to ask why people choose what
                they choose, and I still ask it when I build.
            </DocumentSectionBody>
        </DocumentSection>
    )
}
