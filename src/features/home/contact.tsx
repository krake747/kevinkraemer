import { site } from "@core/site/site-meta"
import { TerminalCommandHeader, TerminalSection } from "@pattern/terminal"
import { Anchor } from "@ui/anchor"
import { MessageCircleIcon } from "@ui/icon"
import type { VoidProps } from "solid-js"

export function HomeContact(props: VoidProps<{ id: string }>) {
    return (
        <TerminalSection id={props.id}>
            <TerminalCommandHeader id={`${props.id}-command`} command="say hello" class="reveal-item mb-8" />
            <div class="flex max-w-prose flex-col gap-6">
                <p class="reveal-item text-base/[1.8] text-stone-600 dark:text-stone-400">
                    Got something you want to build, a role to fill, or feel like talking shop? Write me. I reply to
                    every note, usually within a couple of business days.
                </p>
                <Anchor
                    href={`mailto:${site.email}`}
                    variant="mono"
                    class="reveal-item hit-area-y-2 inline-flex items-center gap-2 text-base wrap-break-word text-stone-900 hover:text-emerald-800 sm:text-lg dark:text-stone-200 dark:hover:text-emerald-400"
                >
                    {site.email}
                </Anchor>
                <p class="reveal-item flex items-center gap-2 font-mono text-sm text-stone-600 tabular-nums dark:text-stone-400">
                    <MessageCircleIcon class="size-4 shrink-0" />
                    <span>open, replies in 2d</span>
                </p>
                <p class="reveal-item font-mono text-sm text-stone-600 dark:text-stone-400">Based in Luxembourg</p>
            </div>
        </TerminalSection>
    )
}
