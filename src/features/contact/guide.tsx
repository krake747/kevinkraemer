import { DocumentSection, DocumentSectionBody, SectionHeading } from "@pattern/section"
export function ContactGuide() {
    return (
        <DocumentSection aria-labelledby="contact-write-heading">
            <SectionHeading id="contact-write-heading">what to include</SectionHeading>
            <DocumentSectionBody>
                <p>
                    Write about anything: a role, a project, or a detail from this site or my experience you want to
                    talk about. Tell me what caught your eye and what you're after, and I can skip the first round of
                    guessing.
                </p>
            </DocumentSectionBody>
        </DocumentSection>
    )
}
