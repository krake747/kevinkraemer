import { PanelLabel } from "@pattern/section"
import { Anchor } from "@ui/anchor"
import { For } from "solid-js"

const AMA_LINKS = [
    { label: "developers", href: "/developers", note: "Endpoints and the MCP server" },
    { label: "llms.txt", href: "/llms.txt", note: "What agents may read" },
    { label: "openapi.json", href: "/openapi.json", note: "The ask contract" },
] as const

export function AmaAbout() {
    return (
        <div class="flex flex-col gap-4">
            <div>
                <PanelLabel id="ama-about-label">about</PanelLabel>
                <p class="font-mono text-xs text-stone-600 dark:text-stone-400">
                    Answers come only from published pages. Every answer lists its sources.
                </p>
            </div>
            <ul class="flex flex-col gap-2">
                <For each={AMA_LINKS}>
                    {(link) => (
                        <li class="flex flex-col gap-1">
                            <Anchor href={link.href} variant="subtle">
                                {link.label}
                            </Anchor>
                            <span class="font-mono text-xs text-stone-600 dark:text-stone-400">{link.note}</span>
                        </li>
                    )}
                </For>
            </ul>
        </div>
    )
}
