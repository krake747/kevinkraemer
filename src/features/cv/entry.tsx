import { createContext, useContext, type ParentProps } from "solid-js"

const CvEntryContext = createContext<() => boolean>(() => false)

export function CvEntry(props: ParentProps<{ current?: boolean }>) {
    const current = () => props.current === true
    return <CvEntryContext value={current}>{props.children}</CvEntryContext>
}

export function useCvEntryCurrent(): () => boolean {
    return useContext(CvEntryContext)
}
