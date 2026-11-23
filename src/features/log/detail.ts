import { findById, getRelatedLogEntries, sortByDateDesc, type LogEntry } from "@core/content/model"

export type LogDetail = {
    entry: LogEntry
    older?: LogEntry
    newer?: LogEntry
    related: LogEntry[]
}

const RELATED_LIMIT = 3

export function resolveLogDetail(entries: readonly LogEntry[], slug: string | undefined): LogDetail | undefined {
    const sorted = sortByDateDesc(entries)
    const entry = findById(sorted, slug)
    if (entry === undefined) {
        return undefined
    }
    const index = sorted.indexOf(entry)
    return {
        entry,
        older: index + 1 < sorted.length ? sorted[index + 1] : undefined,
        newer: index > 0 ? sorted[index - 1] : undefined,
        related: getRelatedLogEntries(sorted, entry.id, entry.tags, RELATED_LIMIT),
    }
}
