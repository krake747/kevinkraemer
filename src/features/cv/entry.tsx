import type { EmploymentPeriod } from "@core/content/model"
import { createContext, useContext, type ParentProps } from "solid-js"

const CvEntryContext = createContext<() => boolean>(() => false)

export function CvEntry(props: ParentProps<{ period: EmploymentPeriod }>) {
    const current = () => props.period.kind === "current"
    return <CvEntryContext value={current}>{props.children}</CvEntryContext>
}

export function useCvEntryCurrent(): () => boolean {
    return useContext(CvEntryContext)
}
