import { CvSection } from "@features/cv/section"
import { CvSectionHeading } from "@features/cv/section-heading"
import { Stack } from "@pattern/stack"
import { StackRow } from "@pattern/stack-row"
import { Anchor } from "@ui/anchor"
import { ArrowUpRight } from "@ui/icon"
import { For, Show, type VoidProps } from "solid-js"

type SideProject = {
    name: string
    description: string
    tech: string[]
    url?: string
}

const SIDE_PROJECTS: SideProject[] = [
    {
        name: "kevinkraemer",
        description:
            "Terminal-inspired personal site. The CV, logs and case files render from Markdown at build time, and the theme follows the system setting.",
        tech: ["Solid", "TypeScript", "Tailwind CSS"],
        url: "https://kevinkraemer.com",
    },
    {
        name: "next-bite",
        description:
            "A web app where friends share and discover restaurant recommendations. Google Maps puts the recommendations on a map, and photos upload from the phone.",
        tech: ["SolidJS", "Vite", "Tailwind CSS", "Convex", "Formisch", "Valibot"],
        url: "https://nextbite.kevinkraemer.com",
    },
]

export function CvProjects(props: VoidProps<{ id: string }>) {
    return (
        <CvSection id={props.id}>
            <CvSectionHeading>
                <Anchor href="/projects" variant="muted" class="text-xs">
                    Projects
                </Anchor>
            </CvSectionHeading>
            <Stack>
                <For each={SIDE_PROJECTS}>
                    {(project) => (
                        <StackRow class="group">
                            <div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                                <div class="flex items-center gap-2">
                                    <span class="text-base font-semibold text-emerald-800 dark:text-emerald-400">
                                        {project.name}
                                    </span>
                                    <Show when={project.url}>
                                        {(url) => (
                                            <Anchor
                                                href={url()}
                                                variant="mono"
                                                target={{ kind: "external" }}
                                                aria-label={`${project.name} (opens in new tab)`}
                                                class="inline-flex"
                                            >
                                                <ArrowUpRight class="size-3" />
                                            </Anchor>
                                        )}
                                    </Show>
                                </div>
                            </div>
                            <p class="mt-1 text-sm text-pretty text-stone-600 dark:text-stone-400">
                                {project.description}
                            </p>
                            <p class="mt-2 font-mono text-xs text-stone-600 dark:text-stone-300">
                                {project.tech.join(" · ")}
                            </p>
                        </StackRow>
                    )}
                </For>
            </Stack>
        </CvSection>
    )
}
