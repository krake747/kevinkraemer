import type { Project } from "@core/content/model"
import { ProjectHeader } from "@features/project/header"
import { ProjectMetadata } from "@features/project/metadata"
import { Anchor } from "@ui/anchor"
import { ChevronLeft } from "@ui/icon"
import { Stack } from "@ui/stack"
import { StackRow } from "@ui/stack-row"
import { For, Show, type ParentProps, type VoidProps } from "solid-js"

function ProjectSection(props: ParentProps<{ id: string; title: string }>) {
    return (
        <section class="mb-12" aria-labelledby={`${props.id}-heading`}>
            <h2
                id={`${props.id}-heading`}
                class="text-xl font-semibold tracking-tight text-stone-900 dark:text-stone-100"
            >
                {props.title}
            </h2>
            {props.children}
        </section>
    )
}

export function ProjectEntry(props: VoidProps<{ project: Project }>) {
    return (
        <article class="mx-auto max-w-prose">
            <ProjectHeader project={props.project} />
            <ProjectMetadata project={props.project} />
            <ProjectSection id="problem" title="Problem and point of view">
                <p class="mt-4 text-base/[1.8] text-stone-600 dark:text-stone-400">{props.project.problem}</p>
            </ProjectSection>
            <Show when={props.project.decisions.length > 0}>
                <ProjectSection id="decisions" title="Key decisions">
                    <Stack class="mt-4">
                        <For each={props.project.decisions}>
                            {(decision) => (
                                <StackRow>
                                    <h3 class="font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                                        {decision.title}
                                    </h3>
                                    <p class="mt-2 font-mono text-sm/[1.8] text-stone-600 dark:text-stone-400">
                                        {decision.reason}
                                    </p>
                                </StackRow>
                            )}
                        </For>
                    </Stack>
                </ProjectSection>
            </Show>
            <Show when={props.project.evidence.length > 0}>
                <ProjectSection id="evidence" title="Evidence">
                    <Stack class="mt-4">
                        <For each={props.project.evidence}>
                            {(item) => (
                                <StackRow as="figure" size="compact">
                                    <p class="font-mono text-sm/[1.8] text-stone-700 dark:text-stone-300">
                                        {item.caption}
                                    </p>
                                </StackRow>
                            )}
                        </For>
                    </Stack>
                </ProjectSection>
            </Show>
            <Show when={props.project.changelog.length > 0}>
                <ProjectSection id="changelog" title="Changelog">
                    <Stack as="ul" class="mt-4">
                        <For each={props.project.changelog}>
                            {(item) => (
                                <StackRow
                                    as="li"
                                    class="grid gap-1 sm:grid-cols-[minmax(0,16rem)_1fr] sm:items-baseline sm:gap-4"
                                >
                                    {item.href ? (
                                        <Anchor href={item.href} variant="muted" target={{ kind: "external" }}>
                                            {item.label}
                                        </Anchor>
                                    ) : (
                                        <span class="font-mono text-sm text-stone-900 dark:text-stone-100">
                                            {item.label}
                                        </span>
                                    )}
                                    {item.note ? (
                                        <span class="font-mono text-sm/[1.8] text-stone-600 dark:text-stone-400">
                                            {item.note}
                                        </span>
                                    ) : null}
                                </StackRow>
                            )}
                        </For>
                    </Stack>
                </ProjectSection>
            </Show>
            <p class="mt-10">
                <Anchor href="/projects" variant="muted" class="inline-flex items-center gap-1.5">
                    <ChevronLeft class="size-3 shrink-0" />
                    Back to all case files
                </Anchor>
            </p>
        </article>
    )
}
