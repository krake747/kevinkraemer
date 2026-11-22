import type { LogEntry } from "@core/content/model"

type LogEntryOverrides = Partial<Omit<LogEntry, "id">>

export function makeLogEntry(id: string, overrides: LogEntryOverrides = {}): LogEntry {
    return {
        id,
        title: id,
        description: "desc",
        date: "2026-01-01",
        tags: [],
        body: "body",
        html: "<p>body</p>",
        graphs: [],
        ...overrides,
    }
}
