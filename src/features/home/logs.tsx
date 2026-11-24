import type { LogEntry } from "@core/content/model"
import { LandingSection } from "@pattern/landing-section"
import { Register, RegisterRow } from "@pattern/register"
import { For, Show, type ParentProps } from "solid-js"

export function HomeLogs(props: ParentProps<{ entries: LogEntry[]; id: string }>) {
    return (
        <Show when={props.entries.length > 0}>
            <LandingSection id={props.id} command="tail -f ~/logs">
                <Register class="reveal-item">
                    <For each={props.entries}>
                        {(entry) => (
                            <RegisterRow
                                href={`/logs/${entry.id}`}
                                title={entry.title}
                                description={entry.description}
                                lines={1}
                            />
                        )}
                    </For>
                </Register>
                <div class="reveal-item mt-4 flex justify-end">{props.children}</div>
            </LandingSection>
        </Show>
    )
}
