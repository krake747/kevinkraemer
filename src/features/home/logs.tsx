import type { LogEntry } from "@core/content/model"
import { Register, RegisterRow, RegisterRowDescription, RegisterRowTitle } from "@pattern/register"
import { TerminalCommandHeader, TerminalSection } from "@pattern/terminal"
import { For, Show, type ParentProps } from "solid-js"

export function HomeLogs(props: ParentProps<{ entries: LogEntry[]; id: string }>) {
    return (
        <Show when={props.entries.length > 0}>
            <TerminalSection id={props.id}>
                <TerminalCommandHeader id={`${props.id}-command`} command="tail -f ~/logs" class="reveal-item mb-8" />
                <Register class="reveal-item">
                    <For each={props.entries}>
                        {(entry) => (
                            <RegisterRow href={`/logs/${entry.id}`}>
                                <RegisterRowTitle>{entry.title}</RegisterRowTitle>
                                <RegisterRowDescription lines={1}>{entry.description}</RegisterRowDescription>
                            </RegisterRow>
                        )}
                    </For>
                </Register>
                <div class="reveal-item mt-4 flex justify-end">{props.children}</div>
            </TerminalSection>
        </Show>
    )
}
