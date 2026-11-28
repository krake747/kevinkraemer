import { Anchor } from "@ui/anchor"
import { For } from "solid-js"

const QUICK_LINKS = [
    { href: "/logs", label: "~/logs" },
    { href: "/cv", label: "~/cv" },
    { href: "/about", label: "~/about" },
    { href: "/uses", label: "~/uses" },
]

export function SearchShortcuts() {
    return (
        <div class="mt-4 flex flex-wrap gap-2">
            <For each={QUICK_LINKS}>
                {(link) => (
                    <Anchor
                        href={link.href}
                        variant="subtle"
                        class="hit-area-y-2.5 border border-stone-200 px-2.5 py-1 hover:border-emerald-500/30 dark:border-stone-800"
                    >
                        {link.label}
                    </Anchor>
                )}
            </For>
        </div>
    )
}
