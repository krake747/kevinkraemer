import type { LogEntry } from "@core/content/model"
import { getReadTime } from "@core/time/read-time"

export type LogSummary = Pick<LogEntry, "id" | "title" | "description" | "date" | "tags"> & {
    readTime: string
}

export function toLogSummaries(entries: LogEntry[]): LogSummary[] {
    return entries.map((entry) => ({
        id: entry.id,
        title: entry.title,
        description: entry.description,
        date: entry.date,
        tags: entry.tags,
        readTime: getReadTime(entry.body),
    }))
}
