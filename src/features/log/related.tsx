import type { LogEntry } from "@core/content/model"
import { formatDateShort } from "@core/time/date"
import { Register, RegisterRow } from "@pattern/register"
import { SectionHeading } from "@ui/section-heading"
import { For, type VoidProps } from "solid-js"

export function LogRelated(props: VoidProps<{ entries: LogEntry[] }>) {
    return (
        <>
            {props.entries.length > 0 ? (
                <div class="mt-10">
                    <SectionHeading id="log-related-heading">related</SectionHeading>
                    <Register>
                        <For each={props.entries}>
                            {(item) => (
                                <RegisterRow
                                    href={`/logs/${item.id}`}
                                    title={item.title}
                                    meta={<span>{formatDateShort(item.date)}</span>}
                                />
                            )}
                        </For>
                    </Register>
                </div>
            ) : null}
        </>
    )
}
