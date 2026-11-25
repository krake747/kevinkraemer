import type { LogEntry } from "@core/content/model"
import { formatDateShort } from "@core/time/date"
import { RegisterRow, RegisterRowMeta, RegisterRowTitle } from "@pattern/register"
import { SectionHeading } from "@pattern/section-heading"
import { Stack } from "@pattern/stack"
import { For, Show, type VoidProps } from "solid-js"

export function LogRelated(props: VoidProps<{ entries: LogEntry[] }>) {
    return (
        <Show when={props.entries.length > 0}>
            <div class="mt-10">
                <SectionHeading id="log-related-heading">related</SectionHeading>
                <Stack>
                    <For each={props.entries}>
                        {(item) => (
                            <RegisterRow href={`/logs/${item.id}`}>
                                <RegisterRowTitle>{item.title}</RegisterRowTitle>
                                <RegisterRowMeta>
                                    <span>{formatDateShort(item.date)}</span>
                                </RegisterRowMeta>
                            </RegisterRow>
                        )}
                    </For>
                </Stack>
            </div>
        </Show>
    )
}
