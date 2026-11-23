import { ProseSection, ProseSectionBody } from "@ui/prose-section"
import { SectionHeading } from "@ui/section-heading"

export function AboutOutside() {
    return (
        <ProseSection aria-labelledby="about-outside-heading">
            <SectionHeading id="about-outside-heading">outside work</SectionHeading>
            <ProseSectionBody>
                <p>
                    Road or gravel bike when the weather allows, and working through the local food scene with
                    friends. I'm modeling finance domain logic in OCaml, with a bit of Rust on the side, and I still
                    follow the markets I no longer have to hedge.
                </p>
            </ProseSectionBody>
        </ProseSection>
    )
}
