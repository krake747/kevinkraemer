import type { Project, ProjectDecision } from "@core/content/model"
import { ProjectHeader } from "@features/project/header"
import { ProjectMetadata } from "@features/project/metadata"
import { ProjectRail } from "@features/project/rail"
import { RegisterWithRail, RegisterWithRailMain, RegisterWithRailRail, ReturnToRegister } from "@pattern/register"
import { Stack, StackRow } from "@pattern/stack"
import { type ComponentProps } from "@solidjs/web"
import { cx } from "@ui/cva.config"
import { For, Show, omit, type VoidProps } from "solid-js"

function ProjectSection(props: ComponentProps<"section">) {
    const rest = omit(props, "class", "children")
    return (
        <section {...rest} class={cx("mb-12", props.class)}>
            {props.children}
        </section>
    )
}

function ProjectSectionHeading(props: ComponentProps<"h2">) {
    const rest = omit(props, "class", "children")
    return (
        <h2
            {...rest}
            class={cx("text-xl font-semibold tracking-tight text-stone-900 dark:text-stone-100", props.class)}
        >
            {props.children}
        </h2>
    )
}

function ProjectDecisionList(props: VoidProps<{ items: ProjectDecision[] }>) {
    return (
        <Stack class="mt-4">
            <For each={props.items}>
                {(item) => (
                    <StackRow>
                        <h3 class="font-semibold tracking-tight text-stone-900 dark:text-stone-100">{item.title}</h3>
                        <p class="mt-2 font-mono text-sm/[1.8] text-stone-600 dark:text-stone-400">{item.reason}</p>
                    </StackRow>
                )}
            </For>
        </Stack>
    )
}

export function ProjectEntry(props: VoidProps<{ project: Project }>) {
    return (
        <article class="mx-auto max-w-4xl">
            <ProjectHeader project={props.project} />
            <div class="mb-12 lg:hidden">
                <ProjectMetadata project={props.project} />
            </div>
            <RegisterWithRail spacing="loose" width="wide">
                <RegisterWithRailMain>
                    <ProjectSection aria-labelledby="problem-heading">
                        <ProjectSectionHeading id="problem-heading">
                            Problem and point of view
                        </ProjectSectionHeading>
                        <p class="mt-4 text-base/[1.8] text-stone-600 dark:text-stone-400">
                            {props.project.problem}
                        </p>
                    </ProjectSection>
                    <Show when={props.project.decisions.length > 0}>
                        <ProjectSection aria-labelledby="decisions-heading">
                            <ProjectSectionHeading id="decisions-heading">Key decisions</ProjectSectionHeading>
                            <ProjectDecisionList items={props.project.decisions} />
                        </ProjectSection>
                    </Show>
                    <Show when={props.project.implementation}>
                        {(implementation) => (
                            <ProjectSection aria-labelledby="implementation-heading">
                                <ProjectSectionHeading id="implementation-heading">
                                    Technical implementation
                                </ProjectSectionHeading>
                                <div class="mt-4 flex flex-col gap-4">
                                    <For each={implementation()}>
                                        {(paragraph) => (
                                            <p class="text-base/[1.8] text-stone-600 dark:text-stone-400">
                                                {paragraph}
                                            </p>
                                        )}
                                    </For>
                                </div>
                            </ProjectSection>
                        )}
                    </Show>
                    <Show when={props.project.tradeoffs.length > 0}>
                        <ProjectSection aria-labelledby="tradeoffs-heading">
                            <ProjectSectionHeading id="tradeoffs-heading">
                                Challenges and trade-offs
                            </ProjectSectionHeading>
                            <ProjectDecisionList items={props.project.tradeoffs} />
                        </ProjectSection>
                    </Show>
                </RegisterWithRailMain>
                <RegisterWithRailRail labelledby="project-rail-label">
                    <ProjectRail project={props.project} />
                </RegisterWithRailRail>
            </RegisterWithRail>
            <p class="mt-10">
                <ReturnToRegister href="/projects">Back to all case files</ReturnToRegister>
            </p>
        </article>
    )
}
