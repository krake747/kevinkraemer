import type { Project } from "@core/content/model"
import { ProjectMetadata } from "@features/project/metadata"
import { PanelLabel } from "@pattern/section"
import { For, type VoidProps } from "solid-js"

const RAIL_TOC = [
    { href: "#problem-heading", label: "problem" },
    { href: "#decisions-heading", label: "decisions" },
    { href: "#implementation-heading", label: "implementation" },
    { href: "#tradeoffs-heading", label: "trade-offs" },
] as const

export function ProjectRail(props: VoidProps<{ project: Project }>) {
    return (
        <>
            <PanelLabel id="project-rail-label" class="mb-0 border-b border-stone-200 pb-2 dark:border-stone-800">
                case file
            </PanelLabel>
            <ProjectMetadata project={props.project} />
            <nav aria-label="On this page" class="mt-2">
                <PanelLabel class="border-b border-stone-200 pb-2 dark:border-stone-800">on this page</PanelLabel>
                <ol class="mt-2 flex flex-col gap-2 font-mono text-sm">
                    <For each={RAIL_TOC}>
                        {(item) => (
                            <li>
                                <a
                                    href={item.href}
                                    class="text-stone-600 transition-colors hover:text-emerald-700 dark:text-stone-400 dark:hover:text-emerald-400"
                                >
                                    {item.label}
                                </a>
                            </li>
                        )}
                    </For>
                </ol>
            </nav>
        </>
    )
}
