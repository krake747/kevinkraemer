import type { Project } from "@core/content/model"
import { RecordRow, RecordRowLabel } from "@pattern/record"
import { Register } from "@pattern/register"
import { Anchor } from "@ui/anchor"
import { Show, type VoidProps } from "solid-js"

export function ProjectMetadata(props: VoidProps<{ project: Project }>) {
    return (
        <Register render={(renderProps) => <dl {...renderProps} />} aria-label="Project metadata" class="mb-12">
            <RecordRow>
                <RecordRowLabel>Role</RecordRowLabel>
                <dd class="font-mono text-sm/[1.8] text-stone-600 dark:text-stone-400">{props.project.role}</dd>
            </RecordRow>
            <RecordRow>
                <RecordRowLabel>Stack</RecordRowLabel>
                <dd class="font-mono text-sm text-stone-600 tabular-nums dark:text-stone-400">
                    {props.project.stack.join(" · ")}
                </dd>
            </RecordRow>
            <RecordRow>
                <RecordRowLabel>Status</RecordRowLabel>
                <dd class="font-mono text-sm text-stone-600 tabular-nums dark:text-stone-400">
                    <span class="tracking-widest uppercase">{props.project.status}</span>
                    {props.project.year !== undefined ? ` · ${props.project.year}` : ""}
                </dd>
            </RecordRow>
            <Show when={props.project.liveUrl}>
                {(liveUrl) => (
                    <RecordRow>
                        <RecordRowLabel>Live</RecordRowLabel>
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
                    <RecordRow>
                        <RecordRowLabel>Repo</RecordRowLabel>
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
