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
                <p class="max-w-[28rem] text-sm/relaxed text-stone-600 dark:text-stone-400">
                    The financial-market framing across this site is a design metaphor. Nothing here is live market
                    data.
                </p>
            </DocumentSectionBody>
        </DocumentSection>
    )
}
