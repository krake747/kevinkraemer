import type { ParentProps } from "solid-js"

export function CvFacts(props: ParentProps) {
    return <div class="grid gap-x-8 gap-y-3 sm:grid-cols-2">{props.children}</div>
}

export function CvFact(props: ParentProps<{ label: string }>) {
    return (
        <div class="grid min-w-0 grid-cols-[5rem_1fr] items-baseline gap-x-3">
            <span class="font-mono text-xs/5 tracking-widest text-stone-600 uppercase dark:text-stone-400">
                {props.label}
            </span>
            <span class="text-sm/5 text-stone-700 dark:text-stone-300">{props.children}</span>
        </div>
    )
}
