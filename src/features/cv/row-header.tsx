import type { ParentProps } from "solid-js"

export function CvRowHeader(props: ParentProps) {
    return <div class="mb-2 flex flex-wrap items-baseline gap-x-3">{props.children}</div>
}

export function CvRowHeaderTitle(props: ParentProps) {
    return <h3 class="text-base font-semibold text-stone-900 dark:text-stone-100">{props.children}</h3>
}

export function CvRowHeaderMeta(props: ParentProps) {
    return <span class="font-mono text-xs text-stone-600 dark:text-stone-300">{props.children}</span>
}
