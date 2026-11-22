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
                    <a
                        href={link.href}
                        class="hit-area-y-2.5 border border-stone-200 px-2.5 py-1 font-mono text-xs text-stone-600 transition-colors hover:border-emerald-500/30 hover:text-emerald-800 dark:border-stone-800 dark:text-stone-400 dark:hover:text-emerald-400"
                    >
                        {link.label}
                    </a>
                )}
            </For>
        </div>
    )
}
