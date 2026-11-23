import { ProseSection, ProseSectionBody } from "@ui/prose-section"
import { SectionHeading } from "@ui/section-heading"

export function PrivacyLocalStorage() {
    return (
        <ProseSection aria-labelledby="privacy-localstorage-heading">
            <SectionHeading id="privacy-localstorage-heading">local storage</SectionHeading>
            <ProseSectionBody>
                <p>
                    One display preference is saved in your browser's localStorage: the color theme (light or dark),
                    which controls how this site looks on your next visit.
                </p>
                <p>
                    This data never leaves your browser. It is not transmitted to any server, shared with anyone, or
                    readable by other sites. Clearing your browser's site data removes it entirely, and the site falls
                    back to its defaults.
                </p>
            </ProseSectionBody>
        </ProseSection>
    )
}
