import type { JSX } from "@solidjs/web"

export function CvSection(props: { id: string; heading: JSX.Element; children?: JSX.Element }) {
    return (
        <section id={props.id} class="animate-fade-up pt-2">
            <h2 class="mb-2 flex items-center gap-2 font-mono text-xs text-stone-600 dark:text-stone-300">
                <span class="text-emerald-600 dark:text-emerald-400">$</span> <span>{props.heading}</span>
            </h2>
            {props.children}
        </section>
    )
}
