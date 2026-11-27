import { SectionHeading } from "@pattern/section"
import { Anchor } from "@ui/anchor"
import { For } from "solid-js"

const HERO_INDEX = [
    { label: "Projects", href: "/projects", display: "ls ~/projects" },
    { label: "Contact", href: "/contact", display: "echo hello" },
] as const

export function HomeHeroIndex() {
    return (
        <div class="mt-12">
            <SectionHeading id="hero-index-heading">index</SectionHeading>
            <div class="flex flex-col gap-3 font-mono text-sm">
                <For each={HERO_INDEX}>
                    {(entry) => (
                        <div class="flex items-baseline gap-4">
                            <span class="w-20 tracking-widest text-stone-600 uppercase dark:text-stone-300">
                                {entry.label}
                            </span>
                            <Anchor href={entry.href} variant="channel" class="hit-area-y-2">
                                {entry.display}
                            </Anchor>
                        </div>
                    )}
                </For>
            </div>
        </div>
    )
}
