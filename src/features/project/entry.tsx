import type { Project, ProjectDecision } from "@core/content/model"
import { ProjectHeader } from "@features/project/header"
import { ProjectMetadata } from "@features/project/metadata"
import { ProjectRail } from "@features/project/rail"
import { RegisterWithRail, RegisterWithRailMain, RegisterWithRailRail, ReturnToRegister } from "@pattern/register"
import { DocumentSection, DocumentSectionBody, SectionHeading } from "@pattern/section"
import { Stack, StackRow } from "@pattern/stack"
import { For, Show, type VoidProps } from "solid-js"

function ProjectDecisionList(props: VoidProps<{ items: ProjectDecision[] }>) {
    return (
        <Stack>
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
                    <DocumentSection aria-labelledby="problem-heading" class="mb-12">
                        <SectionHeading id="problem-heading">Problem and point of view</SectionHeading>
                        <DocumentSectionBody render={(renderProps) => <p {...renderProps} />}>
                            {props.project.problem}
                        </DocumentSectionBody>
                    </DocumentSection>
                    <Show when={props.project.decisions.length > 0}>
                        <DocumentSection aria-labelledby="decisions-heading" class="mb-12">
                            <SectionHeading id="decisions-heading">Key decisions</SectionHeading>
                            <ProjectDecisionList items={props.project.decisions} />
                        </DocumentSection>
                    </Show>
                    <Show when={props.project.implementation}>
                        {(implementation) => (
                            <DocumentSection aria-labelledby="implementation-heading" class="mb-12">
                                <SectionHeading id="implementation-heading">Technical implementation</SectionHeading>
                                <DocumentSectionBody>
                                    <For each={implementation()}>{(paragraph) => <p>{paragraph}</p>}</For>
                                </DocumentSectionBody>
                            </DocumentSection>
                        )}
                    </Show>
                    <Show when={props.project.tradeoffs.length > 0}>
                        <DocumentSection aria-labelledby="tradeoffs-heading" class="mb-12">
                            <SectionHeading id="tradeoffs-heading">Challenges and trade-offs</SectionHeading>
                            <ProjectDecisionList items={props.project.tradeoffs} />
                        </DocumentSection>
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
