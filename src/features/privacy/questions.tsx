import { site } from "@core/site/site-meta"
import { DocumentSection } from "@pattern/document-section"
import { Anchor } from "@ui/anchor"
import { ProseSectionBody } from "@ui/prose-section"

export function PrivacyQuestions() {
    return (
        <DocumentSection id="privacy-contact-heading" title="questions">
            <ProseSectionBody>
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
            </ProseSectionBody>
        </DocumentSection>
    )
}
