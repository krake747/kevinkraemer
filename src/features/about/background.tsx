import { DocumentSection, DocumentSectionBody } from "@pattern/document-section"
import { SectionHeading } from "@ui/section-heading"

export function AboutBackground() {
    return (
        <DocumentSection aria-labelledby="about-background-heading">
            <SectionHeading id="about-background-heading">background</SectionHeading>
            <DocumentSectionBody as="p">
                I worked as a financial risk analyst. The small tools around the risk models were the part I looked
                forward to, so I moved to software.
            </DocumentSectionBody>
        </DocumentSection>
    )
}
