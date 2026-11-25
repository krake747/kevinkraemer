import { formatDateLong } from "@core/time/date"
import type { LogSummary } from "@features/log/summaries"
import { RegisterRow, RegisterRowDescription, RegisterRowMeta, RegisterRowTitle } from "@pattern/register"
import type { VoidProps } from "solid-js"

export function LogEntryPanel(props: VoidProps<{ entry: LogSummary }>) {
    return (
        <RegisterRow render={(renderProps) => <article {...renderProps} />} href={`/logs/${props.entry.id}`}>
            <RegisterRowTitle render={(title) => <h2 {...title}>{title.children}</h2>}>
                {props.entry.title}
            </RegisterRowTitle>
            <RegisterRowDescription lines={2}>{props.entry.description}</RegisterRowDescription>
            <RegisterRowMeta>
                <span>{formatDateLong(props.entry.date)}</span>
                <span>{props.entry.readTime}</span>
            </RegisterRowMeta>
        </RegisterRow>
    )
}
