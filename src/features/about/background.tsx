import { ProseSection, ProseSectionBody } from "@ui/prose-section"
import { SectionHeading } from "@ui/section-heading"

export function AboutBackground() {
    return (
        <ProseSection aria-labelledby="about-background-heading">
            <SectionHeading id="about-background-heading">background</SectionHeading>
            <ProseSectionBody>
                <p>
                    I worked as a financial risk analyst. The small tools around the risk models were the part I
                    looked forward to, so I moved to software.
                </p>
            </ProseSectionBody>
        </ProseSection>
    )
}
