import type { UsesSection } from "@core/content/model"
import { Anchor } from "@ui/anchor"
import { StackRow } from "@ui/stack-row"
import { For } from "solid-js"

export function UsesNav(props: { sections: UsesSection[]; updated: string }) {
    const total = () =>
        props.sections.reduce(
            (count, section) => count + section.groups.reduce((sum, group) => sum + group.items.length, 0),
            0,
        )

    return (
        <StackRow size="compact" class="flex flex-wrap items-center justify-between gap-3">
            <nav aria-label="Sections">
                <ul class="m-0 flex list-none flex-wrap gap-x-5 gap-y-2 p-0 font-mono text-xs">
                    <For each={props.sections}>
                        {(section) => (
                            <li>
                                <Anchor href={`#${section.id}`} variant="subtle" class="hit-area-y-2">
                                    #{section.id}
                                </Anchor>
                            </li>
                        )}
                    </For>
                </ul>
            </nav>
            <span class="ml-auto font-mono text-xs text-stone-600 tabular-nums dark:text-stone-400">
                {total()} tools · updated {props.updated}
            </span>
        </StackRow>
    )
}
