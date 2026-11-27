import type { ParentProps } from "solid-js"

export function CvFact(props: ParentProps) {
    return <div class="grid min-w-0 grid-cols-[5rem_1fr] items-baseline gap-x-3">{props.children}</div>
}

export function CvFactLabel(props: ParentProps) {
    return (
        <span class="font-mono text-xs/5 tracking-widest text-stone-600 uppercase dark:text-stone-400">
            {props.children}
        </span>
    )
}

export function CvFactValue(props: ParentProps) {
    return <span class="text-sm/5 text-stone-700 dark:text-stone-300">{props.children}</span>
}
