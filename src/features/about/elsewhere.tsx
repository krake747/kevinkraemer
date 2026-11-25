import { DocumentSection, DocumentSectionBody } from "@pattern/document-section"
import { Anchor } from "@ui/anchor"
import { SectionHeading } from "@ui/section-heading"

export function AboutElsewhere() {
    return (
        <DocumentSection aria-labelledby="about-elsewhere-heading">
            <SectionHeading id="about-elsewhere-heading">elsewhere</SectionHeading>
            <DocumentSectionBody render={(renderProps) => <p {...renderProps} />}>
                The professional version lives on the{" "}
                <Anchor href="/cv" variant="prose">
                    CV
                </Anchor>{" "}
                page. Work notes go in the{" "}
                <Anchor href="/logs" variant="prose">
                    logs
                </Anchor>
                . For anything else, the{" "}
                <Anchor href="/contact" variant="prose">
                    contact
                </Anchor>{" "}
                page.
            </DocumentSectionBody>
        </DocumentSection>
    )
}
