import { ProseShell } from "@pattern/prose-shell"
import { Seo } from "@pattern/seo"
import { Anchor } from "@ui/anchor"
import { ProseSection, ProseSectionBody } from "@ui/prose-section"
import { SectionHeading } from "@ui/section-heading"

export default function AboutRoute() {
    return (
        <ProseShell
            command="cat story.md"
            title="Hi, I'm Kevin."
            lede="Full-stack developer in Luxembourg. I started in financial risk; now I build the tools instead of the reports."
        >
            <Seo
                title="About"
                description="Full-stack developer in Luxembourg. I came to software from financial risk, where the small tools I wrote were the part I looked forward to."
                path="/about"
            />
            <ProseSection aria-labelledby="about-background-heading">
                <SectionHeading id="about-background-heading">background</SectionHeading>
                <ProseSectionBody>
                    <p>
                        I worked as a financial risk analyst. The small tools around the risk models were the part I
                        looked forward to, so I moved to software.
                    </p>
                </ProseSectionBody>
            </ProseSection>
            <ProseSection aria-labelledby="about-work-heading">
                <SectionHeading id="about-work-heading">how i work</SectionHeading>
                <ProseSectionBody>
                    <p>
                        Finance still shapes how I work. Decisions happen with partial information and a tradeoff.
                        Building software is mostly the same. Behavioral finance at university taught me to ask why
                        people choose what they choose, and I still ask it when I build.
                    </p>
                </ProseSectionBody>
            </ProseSection>
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
        </ProseShell>
    )
}
