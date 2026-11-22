import { formatLogDateLong } from "@core/content/log-date"
import type { LogSummary } from "@core/content/log-summaries"
import { ArrowRight } from "@ui/icon"
import { StackRow } from "@ui/stack-row"

export function LogCard(props: { entry: LogSummary }) {
    return (
        <StackRow as="article" interactive>
            <a href={`/logs/${props.entry.id}`} class="flex items-center justify-between gap-4">
                <div class="min-w-0 flex-1">
                    <h2 class="truncate font-semibold text-stone-900 transition-colors group-hover:text-emerald-800 dark:text-stone-100 dark:group-hover:text-emerald-400">
                        {props.entry.title}
                    </h2>
                    <p class="mt-1 line-clamp-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                        {props.entry.description}
                    </p>
                    <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-stone-600 tabular-nums dark:text-stone-400">
                        <span>{formatLogDateLong(props.entry.date)}</span>
                        <span>{props.entry.readTime}</span>
                    </div>
                </div>
                <span
                    aria-hidden="true"
                    class="hidden shrink-0 items-center text-stone-600 transition-colors group-hover:text-emerald-700 sm:inline-flex dark:text-stone-400 dark:group-hover:text-emerald-400"
                >
                    <ArrowRight class="size-4 transition-transform duration-150 ease-out-quart group-hover:pointer-fine:translate-x-1" />
                </span>
            </a>
        </StackRow>
    )
}
