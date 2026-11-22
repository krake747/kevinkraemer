import { site } from "@core/site/site-meta"
import { Anchor } from "@ui/anchor"
import { SectionHeading } from "@ui/section-heading"
import { For } from "solid-js"

const HERO_CONTACTS = [
    { label: "Email", href: `mailto:${site.email}`, display: site.email, external: false },
    {
        label: "Github",
        href: site.socials.github,
        display: "github.com/krake747",
        external: true,
    },
    {
        label: "Linkedin",
        href: site.socials.linkedin,
        display: "linkedin.com/in/kevin-kraemer",
        external: true,
    },
] as const

export function HomeHeroContact() {
    return (
        <div class="mt-12">
            <SectionHeading id="hero-contact-heading">contact</SectionHeading>
            <div class="flex flex-col gap-3 font-mono text-sm">
                <For each={HERO_CONTACTS}>
                    {(contact) => (
                        <div class="flex items-baseline gap-4">
                            <span class="w-20 tracking-widest text-stone-600 uppercase dark:text-stone-300">
                                {contact.label}
                            </span>{" "}
                            <Anchor
                                href={contact.href}
                                variant="channel"
                                external={contact.external}
                                class="hit-area-y-2"
                            >
                                {contact.display}
                            </Anchor>
                        </div>
                    )}
                </For>
            </div>
        </div>
    )
}
