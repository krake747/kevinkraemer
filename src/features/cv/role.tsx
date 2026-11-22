import { useCvEntryCurrent } from "@features/cv/entry"
import { cva, type VariantProps } from "@ui/cva.config"
import type { ParentProps } from "solid-js"

const cvRole = cva({
    base: "mb-1 font-mono text-sm",
    variants: {
        tone: {
            active: "text-emerald-800 dark:text-emerald-400",
            past: "text-stone-600 dark:text-stone-300",
        },
    },
})

export function CvRole(props: ParentProps<{ tone?: VariantProps<typeof cvRole>["tone"] }>) {
    const isCurrent = useCvEntryCurrent()
    const tone = () => cvRole({ tone: props.tone ?? (isCurrent() ? "active" : "past") })
    return <div class={tone()}>{props.children}</div>
}
