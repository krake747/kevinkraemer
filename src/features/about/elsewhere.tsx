import { DocumentSection } from "@pattern/document-section"
import { Anchor } from "@ui/anchor"
import { ProseSectionBody } from "@ui/prose-section"

export function AboutElsewhere() {
    return (
        <DocumentSection id="about-elsewhere-heading" title="elsewhere">
            <ProseSectionBody>
                <p>
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
                </p>
            </ProseSectionBody>
        </DocumentSection>
    )
}
