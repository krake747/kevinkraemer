import type { LogEntry } from "@core/content/model"
import { createLogFilter } from "@features/log/create-filter"
import { createContext, useContext, type ParentProps } from "solid-js"

const LogFilterContext = createContext<ReturnType<typeof createLogFilter>>(undefined, { name: "LogFilter" })

export function LogFilterProvider(props: ParentProps<{ entries: LogEntry[] }>) {
    const filter = createLogFilter(() => props.entries)
    return <LogFilterContext value={filter}>{props.children}</LogFilterContext>
}

export function useLogFilter() {
    return useContext(LogFilterContext)
}
