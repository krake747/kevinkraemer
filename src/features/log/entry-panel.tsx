import { formatDateLong } from "@core/time/date"
import type { LogSummary } from "@features/log/summaries"
import { RegisterRow } from "@pattern/register"
import type { VoidProps } from "solid-js"

export function LogEntryPanel(props: VoidProps<{ entry: LogSummary }>) {
    return (
        <RegisterRow
            as="article"
            titleAs="h2"
            href={`/logs/${props.entry.id}`}
            title={props.entry.title}
            description={props.entry.description}
            lines={2}
            meta={
                <>
                    <span>{formatDateLong(props.entry.date)}</span>
                    <span>{props.entry.readTime}</span>
                </>
            }
        />
    )
}
