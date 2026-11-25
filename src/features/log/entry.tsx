import { formatDateLong } from "@core/time/date"
import { formatWordCount, getReadTime } from "@core/time/read-time"
import { LogBody } from "@features/log/body"
import type { LogDetail } from "@features/log/detail"
import { LogPager } from "@features/log/pager"
import { LogReadingProgress } from "@features/log/reading-progress"
import { LogRelated } from "@features/log/related"
import { LogSubscribe } from "@features/log/subscribe"
import { LogToc, LogTocDisclosure } from "@features/log/toc"
import { PageHeader, PageHeaderMeta, PageHeaderTitle } from "@pattern/page-header"
import { ReturnToRegister } from "@pattern/register"
import { TerminalCommandHeader } from "@pattern/terminal"
import { Badge } from "@ui/badge"
import { Clock, FileText } from "@ui/icon"
import { For, Show, type VoidProps } from "solid-js"

export function LogEntry(props: VoidProps<{ detail: LogDetail }>) {
    const entry = () => props.detail.entry

    return (
        <>
            <LogReadingProgress />
            <div class="lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-10">
                <LogToc entries={entry().toc} />
                <div class="mx-auto w-full max-w-prose lg:mx-0">
                    <PageHeader class="mb-10">
                        <TerminalCommandHeader command={`cat ${entry().id}.md`} class="mb-4" />
                        <PageHeaderTitle>{entry().title}</PageHeaderTitle>
                        <PageHeaderMeta>
                            <div class="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-stone-600 tabular-nums dark:text-stone-400">
                                <span class="flex items-center gap-1.5">
                                    <FileText class="size-3 shrink-0" />
                                    {formatDateLong(entry().date)}
                                </span>{" "}
                                <span class="flex items-center gap-1.5">
                                    <Clock class="size-3 shrink-0" />
                                    {getReadTime(entry().body)}
                                </span>{" "}
                                <span class="text-stone-600 dark:text-stone-400">
                                    {formatWordCount(entry().body)} words
                                </span>
                            </div>
                            <Show when={entry().tags.length > 0}>
                                <div class="mt-3 flex flex-wrap gap-1.5">
                                    <For each={entry().tags}>
                                        {(tag) => (
                                            <>
                                                <Badge
                                                    interactive
                                                    render={(renderProps) => (
                                                        <a
                                                            {...renderProps}
                                                            href={`/search?q=${encodeURIComponent(tag)}`}
                                                        >
                                                            {renderProps.children}
                                                        </a>
                                                    )}
                                                >
                                                    #{tag}
                                                </Badge>{" "}
                                            </>
                                        )}
                                    </For>
                                </div>
                            </Show>
                        </PageHeaderMeta>
                    </PageHeader>
                    <LogTocDisclosure entries={entry().toc} />
                    <LogBody html={entry().html} graphs={entry().graphs} class="log-entry" />
                    <LogRelated entries={props.detail.related} />
                    <LogPager older={props.detail.older} newer={props.detail.newer} />
                    <div class="mt-10 flex flex-wrap items-center justify-between gap-4">
                        <ReturnToRegister href="/logs">Back to all logs</ReturnToRegister>
                        <LogSubscribe />
                    </div>
                </div>
            </div>
        </>
    )
}
