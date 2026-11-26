import { sortByOrder, type Project } from "@core/content/model"
import {
    EmptyRegister,
    EmptyRegisterTitle,
    RegisterRowDescription,
    RegisterRowMeta,
    RegisterRowTitle,
} from "@pattern/register"
import { Anchor } from "@ui/anchor"
import { For, Show, createMemo, type VoidProps } from "solid-js"

function statusLine(project: Project): string {
    const parts = [project.category, project.status, project.year].filter(
        (part): part is string | number => part !== undefined,
    )
    return parts.join(" · ")
}

function FeaturedProject(props: VoidProps<{ project: Project }>) {
    return (
        <li class="group flex flex-col gap-6 border-t border-stone-200/80 px-4 py-10 md:flex-row md:gap-12 dark:border-stone-800">
            <div class="flex flex-col gap-4 md:w-60 md:shrink-0">
                <div class="flex flex-col gap-2">
                    <Anchor
                        href={`/projects/${props.project.id}`}
                        variant="title"
                        class="hit-area-y-1.5 group-hover:pointer-fine:text-emerald-800 dark:group-hover:pointer-fine:text-emerald-400"
                    >
                        {props.project.name}
                    </Anchor>
                    <p class="font-mono text-xs tracking-widest text-stone-600 uppercase tabular-nums dark:text-stone-400">
                        {statusLine(props.project)}
                    </p>
                </div>
                <Show when={props.project.figure}>
                    {(figure) => (
                        <p class="flex flex-col gap-1 font-mono tabular-nums">
                            <span class="text-3xl text-stone-900 dark:text-stone-100">{figure().value}</span>
                            <span class="text-xs text-stone-600 dark:text-stone-400">{figure().label}</span>
                        </p>
                    )}
                </Show>
            </div>
            <div class="flex flex-col gap-4 md:min-w-0 md:flex-1">
                <p class="max-w-prose text-base/relaxed text-stone-700 dark:text-stone-300">{props.project.tagline}</p>
                <p class="font-mono text-xs/relaxed text-stone-600 dark:text-stone-400">
                    {props.project.role} · {props.project.stack.join(" · ")}
                </p>
            </div>
        </li>
    )
}

function CompactProjectRow(props: VoidProps<{ project: Project }>) {
    const titleId = (): string => `project-${props.project.id}-title`
    return (
        <li class="border-t border-stone-200/80 dark:border-stone-800">
            <a
                href={`/projects/${props.project.id}`}
                aria-labelledby={titleId()}
                class="group flex min-w-0 flex-1 px-4 py-5"
            >
                <span class="min-w-0 flex-1">
                    <RegisterRowTitle id={titleId()}>{props.project.name}</RegisterRowTitle>
                    <RegisterRowDescription lines={1}>{props.project.tagline}</RegisterRowDescription>
                    <RegisterRowMeta>{statusLine(props.project)}</RegisterRowMeta>
                </span>
            </a>
        </li>
    )
}

export function ProjectList(props: VoidProps<{ projects: Project[] }>) {
    const ordered = createMemo(() => sortByOrder(props.projects))
    const featured = createMemo(() => ordered().filter((project) => project.featured))
    const rest = createMemo(() => ordered().filter((project) => !project.featured))
    return (
        <div class="flex flex-col gap-12">
            <Show
                when={ordered().length > 0}
                fallback={
                    <EmptyRegister size="spacious">
                        <EmptyRegisterTitle>No case files yet.</EmptyRegisterTitle>
                    </EmptyRegister>
                }
            >
                <Show when={featured().length > 0}>
                    <section aria-label="Featured case files" class="animate-fade-up">
                        <ul class="m-0 flex list-none flex-col p-0">
                            <For each={featured()}>{(project) => <FeaturedProject project={project} />}</For>
                        </ul>
                    </section>
                </Show>
                <Show when={rest().length > 0}>
                    <section aria-label="All case files" class="animate-fade-up">
                        <ul class="m-0 flex list-none flex-col p-0">
                            <For each={rest()}>{(project) => <CompactProjectRow project={project} />}</For>
                        </ul>
                    </section>
                </Show>
            </Show>
        </div>
    )
}
