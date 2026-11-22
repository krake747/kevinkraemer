import { useCvEntryCurrent } from "@features/cv/entry"
import type { ComponentProps } from "@solidjs/web"
import { cva, cx, type VariantProps } from "@ui/cva.config"
import { omit } from "solid-js"

const cvRole = cva({
    base: "mb-1 font-mono text-sm",
    variants: {
        tone: {
            active: "text-emerald-800 dark:text-emerald-400",
            past: "text-stone-600 dark:text-stone-300",
        },
    },
})

export function CvRole(props: ComponentProps<"div"> & VariantProps<typeof cvRole>) {
    const rest = omit(props, "tone", "class", "children")
    const isCurrent = useCvEntryCurrent()
    const tone = () => cx(cvRole({ tone: props.tone ?? (isCurrent() ? "active" : "past"), class: props.class }))
    return (
        <div {...rest} class={tone()}>
            {props.children}
        </div>
    )
}
