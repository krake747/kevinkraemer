import { site } from "@core/site/site-meta"
import { TerminalCommandHeader, TerminalSection } from "@pattern/terminal"
import type { VoidProps } from "solid-js"

export function HomeContact(props: VoidProps<{ id: string }>) {
    return (
        <TerminalSection id={props.id}>
            <TerminalCommandHeader
                id={`${props.id}-command`}
                command={'echo "Get in touch"'}
                class="reveal-item mb-8"
            />
            <div class="flex max-w-prose flex-col gap-6">
                <p class="reveal-item text-base/[1.8] text-stone-600 dark:text-stone-400">
                    Got something you want to build, a role to fill, or feel like talking shop? Write me. I reply to
                    every note, usually within a couple of business days.
                </p>
                <a
                    href={`mailto:${site.email}`}
                    class="reveal-item hit-area-y-2 inline-flex items-center gap-2 font-mono text-base wrap-break-word text-stone-900 transition-colors duration-150 ease-out-quart hover:text-emerald-800 sm:text-lg dark:text-stone-200 dark:hover:text-emerald-400"
                >
                    {site.email}
                </a>
                <p class="reveal-item font-mono text-sm text-stone-600 dark:text-stone-400">Based in Luxembourg</p>
            </div>
        </TerminalSection>
    )
}
