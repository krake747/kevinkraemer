import type { JSX } from "@solidjs/web"

export function CvFacts(props: { children?: JSX.Element }) {
    return <div class="grid gap-x-8 gap-y-3 sm:grid-cols-2">{props.children}</div>
}

export function CvFact(props: { label: string; children?: JSX.Element }) {
    return (
        <div class="grid min-w-0 grid-cols-[5rem_1fr] items-baseline gap-x-3">
            <span class="font-mono text-xs leading-5 tracking-wide text-stone-600 dark:text-stone-400">
                {props.label}
            </span>
            <span class="text-sm leading-5 text-stone-700 dark:text-stone-300">{props.children}</span>
        </div>
    )
}
