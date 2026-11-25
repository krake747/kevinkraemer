import { DocumentSection, DocumentSectionBody } from "@pattern/document-section"
import { Anchor } from "@ui/anchor"

export function AboutElsewhere() {
    return (
        <DocumentSection id="about-elsewhere-heading" title="elsewhere">
            <DocumentSectionBody as="p">
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
