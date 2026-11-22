import { DevelopersIndex } from "@features/developers/index"
import { Anchor } from "@ui/anchor"
import { StackRow } from "@ui/stack-row"
import { For } from "solid-js"

const ON_THIS_PAGE = [
    { href: "#resources-heading", label: "resources" },
    { href: "#quickstart-heading", label: "quickstart" },
    { href: "#json-errors-heading", label: "json errors" },
    { href: "#responses-heading", label: "responses" },
    { href: "#stability-heading", label: "stability" },
]

export function DevelopersOnThisPage() {
    return (
        <StackRow as="nav" size="compact" aria-label="On this page">
            <ol class="flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs">
                <For each={ON_THIS_PAGE}>
                    {(item, index) => (
                        <li class="flex items-center gap-2">
                            <DevelopersIndex index={index()} />{" "}
                            <Anchor href={item.href} variant="channel" class="hit-area-y-2">
                                {item.label}
                            </Anchor>
                        </li>
                    )}
                </For>
            </ol>
        </StackRow>
    )
}
