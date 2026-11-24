import type { VoidProps } from "solid-js"

export function CvRowHeader(props: VoidProps<{ title: string; meta: string }>) {
    return (
        <div class="mb-2 flex flex-wrap items-baseline gap-x-3">
            <h3 class="text-base font-semibold text-stone-900 dark:text-stone-100">{props.title}</h3>
            <span class="font-mono text-xs text-stone-600 dark:text-stone-300">{props.meta}</span>
        </div>
    )
}
