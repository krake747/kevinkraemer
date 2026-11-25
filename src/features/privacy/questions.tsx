import { site } from "@core/site/site-meta"
import { DocumentSection, DocumentSectionBody } from "@pattern/document-section"
import { SectionHeading } from "@pattern/section-heading"
import { Anchor } from "@ui/anchor"

export function PrivacyQuestions() {
    return (
        <DocumentSection aria-labelledby="privacy-contact-heading">
            <SectionHeading id="privacy-contact-heading">questions</SectionHeading>
            <DocumentSectionBody>
                <p>
                    If you email me, I use your address and message solely to reply to you. Nothing from the
                    correspondence is published or passed to third parties.
                </p>
                <p>
                    Questions about anything on this page can go to{" "}
                    <Anchor href={`mailto:${site.email}`} variant="prose" class="break-all">
                        {site.email}
                    </Anchor>
                    . Changes to this policy will be posted on this page.
                </p>
            </DocumentSectionBody>
        </DocumentSection>
    )
}
