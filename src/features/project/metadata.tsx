import type { Project } from "@core/content/model"
import { RecordRow } from "@pattern/record"
import { Register } from "@pattern/register"
import { Anchor } from "@ui/anchor"
import { Show, type VoidProps } from "solid-js"

export function ProjectMetadata(props: VoidProps<{ project: Project }>) {
    return (
        <Register as="dl" aria-label="Project metadata" class="mb-12">
            <RecordRow label="Role">
                <dd class="font-mono text-sm/[1.8] text-stone-600 dark:text-stone-400">{props.project.role}</dd>
            </RecordRow>
            <RecordRow label="Stack">
                <dd class="font-mono text-sm text-stone-600 tabular-nums dark:text-stone-400">
                    {props.project.stack.join(" · ")}
                </dd>
            </RecordRow>
            <RecordRow label="Status">
                <dd class="font-mono text-sm text-stone-600 tabular-nums dark:text-stone-400">
                    <span class="tracking-widest uppercase">{props.project.status}</span>
                    {props.project.year !== undefined ? ` · ${props.project.year}` : ""}
                </dd>
            </RecordRow>
            <Show when={props.project.liveUrl}>
                {(liveUrl) => (
                    <RecordRow label="Live">
                        <dd>
                            <Anchor href={liveUrl()} variant="channel" target={{ kind: "external" }}>
                                {liveUrl().replace(/^https?:\/\//, "")}
                            </Anchor>
                        </dd>
                    </RecordRow>
                )}
            </Show>
            <Show when={props.project.repoUrl}>
                {(repoUrl) => (
                    <RecordRow label="Repo">
                        <dd>
                            <Anchor href={repoUrl()} variant="muted" target={{ kind: "external" }}>
                                {repoUrl().replace(/^https?:\/\//, "")}
                            </Anchor>
                        </dd>
                    </RecordRow>
                )}
            </Show>
        </Register>
    )
}
