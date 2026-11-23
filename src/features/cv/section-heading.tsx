import type { ParentProps } from "solid-js"

export function CvSectionHeading(props: ParentProps) {
    return (
        <h2 class="mb-2 flex items-center gap-2 font-mono text-xs text-stone-600 dark:text-stone-300">
            <span class="text-emerald-600 dark:text-emerald-400">$</span> <span>{props.children}</span>
        </h2>
    )
}
