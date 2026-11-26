import type { Project } from "@core/content/model"
import { ProjectHeader } from "@features/project/header"
import { ProjectMetadata } from "@features/project/metadata"
import { ReturnToRegister } from "@pattern/register"
import { Stack, StackRow } from "@pattern/stack"
import { Anchor } from "@ui/anchor"
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
            <Show when={props.project.implementation}>
                {(implementation) => (
                    <ProjectSection id="implementation" title="Technical implementation">
                        <p class="mt-4 text-base/[1.8] text-stone-600 dark:text-stone-400">{implementation()}</p>
                    </ProjectSection>
                )}
            </Show>
            <Show when={props.project.evidence.length > 0}>
                <ProjectSection id="evidence" title="Evidence">
                    <Stack class="mt-4">
                        <For each={props.project.evidence}>
                            {(item) => (
                                <StackRow render={(renderProps) => <figure {...renderProps} />} size="compact">
                                    <p class="font-mono text-sm/[1.8] text-stone-700 dark:text-stone-300">
                                        {item.caption}
                                    </p>
                                </StackRow>
                            )}
                        </For>
                    </Stack>
                </ProjectSection>
            </Show>
            <Show when={props.project.tradeoffs.length > 0}>
                <ProjectSection id="tradeoffs" title="Challenges and trade-offs">
                    <Stack class="mt-4">
                        <For each={props.project.tradeoffs}>
                            {(tradeoff) => (
                                <StackRow>
                                    <h3 class="font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                                        {tradeoff.title}
                                    </h3>
                                    <p class="mt-2 font-mono text-sm/[1.8] text-stone-600 dark:text-stone-400">
                                        {tradeoff.reason}
                                    </p>
                                </StackRow>
                            )}
                        </For>
                    </Stack>
                </ProjectSection>
            </Show>
            <Show when={props.project.resources.length > 0}>
                <ProjectSection id="resources" title="Links and resources">
                    <Stack render={(renderProps) => <ul {...renderProps} />} class="mt-4">
                        <For each={props.project.resources}>
                            {(item) => (
                                <StackRow
                                    render={(renderProps) => <li {...renderProps} />}
                                    class="grid gap-1 sm:grid-cols-[minmax(0,16rem)_1fr] sm:items-baseline sm:gap-4"
                                >
                                    <Show
                                        when={item.href}
                                        fallback={
                                            <span class="font-mono text-sm text-stone-900 dark:text-stone-100">
                                                {item.label}
                                            </span>
                                        }
                                    >
                                        {(href) => (
                                            <Anchor
                                                href={href()}
                                                variant="muted"
                                                target={{ kind: "external" }}
                                                class="hit-area-y-2"
                                            >
                                                {item.label}
                                            </Anchor>
                                        )}
                                    </Show>
                                    <Show when={item.note}>
                                        {(note) => (
                                            <span class="font-mono text-sm/[1.8] text-stone-600 dark:text-stone-400">
                                                {note()}
                                            </span>
                                        )}
                                    </Show>
                                </StackRow>
                            )}
                        </For>
                    </Stack>
                </ProjectSection>
            </Show>
            <p class="mt-10">
                <ReturnToRegister href="/projects">Back to all case files</ReturnToRegister>
            </p>
        </article>
    )
}
