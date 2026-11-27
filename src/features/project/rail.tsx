import type { Project } from "@core/content/model"
import { PanelLabel } from "@pattern/section"
import { Anchor } from "@ui/anchor"
import { Badge } from "@ui/badge"
import { For, Show, type ParentProps, type VoidProps } from "solid-js"

function RailMetaCell(props: ParentProps<{ label: string }>) {
    return (
        <div class="border-t border-stone-200 py-3 first:border-t-0 first:pt-0 dark:border-stone-800">
            <p class="font-mono text-xs tracking-widest text-stone-600 uppercase dark:text-stone-400">{props.label}</p>
            <div class="mt-1 font-mono text-sm/[1.8] break-words text-stone-700 dark:text-stone-300">
                {props.children}
            </div>
        </div>
    )
}

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
            <div>
                <RailMetaCell label="Role">{props.project.role}</RailMetaCell>
                <RailMetaCell label="Stack">
                    <span class="flex flex-wrap gap-1.5">
                        <For each={props.project.stack}>{(item) => <Badge>{item}</Badge>}</For>
                    </span>
                </RailMetaCell>
                <RailMetaCell label="Status">
                    {props.project.status}
                    {props.project.year !== undefined ? ` · ${props.project.year}` : ""}
                </RailMetaCell>
                <Show when={props.project.liveUrl}>
                    {(liveUrl) => (
                        <RailMetaCell label="Live">
                            <Anchor
                                href={liveUrl()}
                                variant="channel"
                                target={{ kind: "external" }}
                                class="hit-area-y-2"
                            >
                                {liveUrl().replace(/^https?:\/\//, "")}
                            </Anchor>
                        </RailMetaCell>
                    )}
                </Show>
                <Show when={props.project.repoUrl}>
                    {(repoUrl) => (
                        <RailMetaCell label="Repo">
                            <Anchor href={repoUrl()} variant="muted" target={{ kind: "external" }} class="hit-area-y-2">
                                {repoUrl().replace(/^https?:\/\//, "")}
                            </Anchor>
                        </RailMetaCell>
                    )}
                </Show>
            </div>
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
