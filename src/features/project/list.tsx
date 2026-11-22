import { sortByOrder, type Project } from "@core/content/model"
import { Anchor } from "@ui/anchor"
import { For, Show } from "solid-js"

export function ProjectList(props: { projects: Project[] }) {
    const ordered = () => sortByOrder(props.projects)
    return (
        <section aria-label="Case files" class="animate-fade-up [animation-delay:100ms]">
            <Show
                when={ordered().length > 0}
                fallback={
                    <div class="py-20 text-center">
                        <p class="font-mono text-sm text-stone-600 dark:text-stone-300">No case files yet.</p>
                    </div>
                }
            >
                <ul class="m-0 flex list-none flex-col p-0">
                    <For each={ordered()}>
                        {(project) => (
                            <li class="flex flex-col gap-6 border-t border-stone-200/80 py-10 md:flex-row md:gap-12 dark:border-stone-800">
                                <div class="flex flex-col gap-4 md:w-60 md:shrink-0">
                                    <div class="flex flex-col gap-2">
                                        <Anchor href={`/projects/${project.id}`} variant="title" class="hit-area-y-1.5">
                                            {project.name}
                                        </Anchor>
                                        <p class="font-mono text-xs tracking-wide text-stone-600 uppercase tabular-nums dark:text-stone-400">
                                            {project.status}
                                            {project.year !== undefined ? ` · ${project.year}` : ""}
                                        </p>
                                    </div>
                                    <Show when={project.figure}>
                                        {(figure) => (
                                            <p class="flex flex-col gap-1 font-mono tabular-nums">
                                                <span class="text-3xl text-stone-900 dark:text-stone-100">
                                                    {figure().value}
                                                </span>
                                                <span class="text-xs text-stone-600 dark:text-stone-400">
                                                    {figure().label}
                                                </span>
                                            </p>
                                        )}
                                    </Show>
                                </div>
                                <div class="flex flex-col gap-4 md:min-w-0 md:flex-1">
                                    <p class="max-w-prose text-base leading-relaxed text-stone-700 dark:text-stone-300">
                                        {project.tagline}
                                    </p>
                                    <p class="font-mono text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                                        {project.role} · {project.stack.join(" · ")}
                                    </p>
                                </div>
                            </li>
                        )}
                    </For>
                </ul>
            </Show>
        </section>
    )
}
