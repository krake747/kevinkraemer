import type { Project } from "@core/content/model"
import { ProjectMetadataRow } from "@features/project/metadata-row"
import { Anchor } from "@ui/anchor"
import { Stack } from "@ui/stack"
import { Show, type VoidProps } from "solid-js"

export function ProjectMetadata(props: VoidProps<{ project: Project }>) {
    return (
        <Stack as="dl" aria-label="Project metadata" class="mb-12">
            <ProjectMetadataRow label="Role">
                <dd class="font-mono text-sm/[1.8] text-stone-600 dark:text-stone-400">{props.project.role}</dd>
            </ProjectMetadataRow>
            <ProjectMetadataRow label="Stack">
                <dd class="font-mono text-sm text-stone-600 tabular-nums dark:text-stone-400">
                    {props.project.stack.join(" · ")}
                </dd>
            </ProjectMetadataRow>
            <ProjectMetadataRow label="Status">
                <dd class="font-mono text-sm text-stone-600 tabular-nums dark:text-stone-400">
                    <span class="tracking-widest uppercase">{props.project.status}</span>
                    {props.project.year !== undefined ? ` · ${props.project.year}` : ""}
                </dd>
            </ProjectMetadataRow>
            <Show when={props.project.liveUrl}>
                {(liveUrl) => (
                    <ProjectMetadataRow label="Live">
                        <dd>
                            <Anchor href={liveUrl()} variant="channel" external>
                                {liveUrl().replace(/^https?:\/\//, "")}
                            </Anchor>
                        </dd>
                    </ProjectMetadataRow>
                )}
            </Show>
            <Show when={props.project.repoUrl}>
                {(repoUrl) => (
                    <ProjectMetadataRow label="Repo">
                        <dd>
                            <Anchor href={repoUrl()} variant="muted" external>
                                {repoUrl().replace(/^https?:\/\//, "")}
                            </Anchor>
                        </dd>
                    </ProjectMetadataRow>
                )}
            </Show>
        </Stack>
    )
}
