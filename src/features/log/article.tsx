import { formatLogDateLong } from "@core/content/log-date"
import { formatWordCount, getReadTime } from "@core/time/read-time"
import { LogBody } from "@features/log/body"
import type { LogDetail } from "@features/log/detail"
import { LogPager } from "@features/log/pager"
import { LogReadingProgress } from "@features/log/reading-progress"
import { LogRelated } from "@features/log/related"
import { LogSubscribe } from "@features/log/subscribe"
import { LogToc, LogTocDisclosure } from "@features/log/toc"
import { Badge } from "@ui/badge"
import { ChevronLeft, Clock, FileText } from "@ui/icon"
import { TerminalCommandHeader } from "@ui/terminal-command-header"
import { For } from "solid-js"

export function LogArticle(props: { detail: LogDetail }) {
    const entry = () => props.detail.entry

    return (
        <>
            <LogReadingProgress />
            <div class="lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-10">
                <LogToc entries={entry().toc} />
                <div class="mx-auto w-full max-w-prose lg:mx-0">
                    <div class="mb-10">
                        <TerminalCommandHeader command={`cat ${entry().id}.md`} class="mb-4" />
                        <h1 class="text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                            {entry().title}
                        </h1>
                        <p class="mt-3 text-sm/relaxed text-stone-600 dark:text-stone-400">{entry().description}</p>
                        <div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-stone-600 tabular-nums dark:text-stone-400">
                            <span class="flex items-center gap-1.5">
                                <FileText class="size-3 shrink-0" />
                                {formatLogDateLong(entry().date)}
                            </span>{" "}
                            <span class="flex items-center gap-1.5">
                                <Clock class="size-3 shrink-0" />
                                {getReadTime(entry().body)}
                            </span>{" "}
                            <span class="text-stone-600 dark:text-stone-400">
                                {formatWordCount(entry().body)} words
                            </span>
                        </div>
                        {entry().tags.length > 0 ? (
                            <div class="mt-3 flex flex-wrap gap-1.5">
                                <For each={entry().tags}>
                                    {(tag) => (
                                        <>
                                            <Badge as="a" href={`/search?q=${encodeURIComponent(tag)}`} interactive>
                                                #{tag}
                                            </Badge>{" "}
                                        </>
                                    )}
                                </For>
                            </div>
                        ) : null}
                    </div>
                    <LogTocDisclosure entries={entry().toc} />
                    <LogBody html={entry().html} graphs={entry().graphs} class="blog-post" />
                    <LogRelated entries={props.detail.related} />
                    <LogPager older={props.detail.older} newer={props.detail.newer} />
                    <div class="mt-10 flex flex-wrap items-center justify-between gap-4">
                        <a
                            href="/logs"
                            class="hit-area-y-2 inline-flex items-center gap-1.5 font-mono text-sm text-stone-600 transition-colors hover:text-emerald-800 dark:text-stone-400 dark:hover:text-emerald-400"
                        >
                            <ChevronLeft class="size-3 shrink-0" />
                            Back to all logs
                        </a>{" "}
                        <LogSubscribe />
                    </div>
                </div>
            </div>
        </>
    )
}
