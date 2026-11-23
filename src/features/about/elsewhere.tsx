import { Anchor } from "@ui/anchor"
import { ProseSection, ProseSectionBody } from "@ui/prose-section"
import { SectionHeading } from "@ui/section-heading"

export function AboutElsewhere() {
    return (
        <ProseSection aria-labelledby="about-elsewhere-heading">
            <SectionHeading id="about-elsewhere-heading">elsewhere</SectionHeading>
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
        </ProseSection>
    )
}
