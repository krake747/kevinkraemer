import { ProseSection, ProseSectionBody } from "@ui/prose-section"
import { SectionHeading } from "@ui/section-heading"

export function AboutWork() {
    return (
        <ProseSection aria-labelledby="about-work-heading">
            <SectionHeading id="about-work-heading">how i work</SectionHeading>
            <ProseSectionBody>
                <p>
                    Finance still shapes how I work. Decisions happen with partial information and a tradeoff. Building
                    software is mostly the same. Behavioral finance at university taught me to ask why people choose
                    what they choose, and I still ask it when I build.
                </p>
            </ProseSectionBody>
        </ProseSection>
    )
}
