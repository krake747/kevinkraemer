import { DocumentSection } from "@pattern/document-section"
import { ProseSectionBody } from "@ui/prose-section"

export function AboutWork() {
    return (
        <DocumentSection id="about-work-heading" title="how i work">
            <ProseSectionBody>
                <p>
                    Finance still shapes how I work. Decisions happen with partial information and a tradeoff. Building
                    software is mostly the same. Behavioral finance at university taught me to ask why people choose
                    what they choose, and I still ask it when I build.
                </p>
            </ProseSectionBody>
        </DocumentSection>
    )
}
