import { toLogSummaries } from "@core/content/log-summaries"
import { filterLogEntries, getAllTags, sortByDateDesc, type LogEntry } from "@core/content/model"
import { createHydrated } from "@pattern/create-browser-value"
import { createUrlQuery } from "@pattern/create-url-query"
import { useSearchParams } from "@solidjs/router"
import { createMemo } from "solid-js"

type LogFilterCounts = {
    shown: number
    total: number
}

export function createLogFilter(entries: () => LogEntry[]) {
    const summaries = createMemo(() => toLogSummaries(entries()))
    const tags = createMemo(() => getAllTags(entries()))
    const [searchParams, setSearchParams] = useSearchParams<{ tag?: string | string[] }>()
    const isReady = createHydrated()
    const query = createUrlQuery({ param: "q", wait: 0 })

    const selectedTags = createMemo<string[]>(() => {
        const tag = searchParams.tag
        if (!isReady() || tag === undefined) {
            return []
        }
        return Array.isArray(tag) ? tag : [tag]
    })

    const toggleTag = (tag: string) => {
        const current = selectedTags()
        const next = current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]
        setSearchParams({ tag: next.length > 0 ? next : undefined }, { replace: true })
    }

    const clear = () => {
        query.clear({ tag: undefined })
    }

    const hasActiveFilters = createMemo(() => selectedTags().length > 0 || query.query().length > 0)

    const visibleEntries = createMemo(() =>
        sortByDateDesc(filterLogEntries(summaries(), selectedTags(), query.query())),
    )

    const counts = createMemo<LogFilterCounts>(() => ({
        shown: visibleEntries().length,
        total: summaries().length,
    }))

    return {
        state: { input: query.input, tags, selectedTags, hasActiveFilters, visibleEntries, counts },
        actions: { updateQuery: query.update, toggleTag, clear },
    }
}
