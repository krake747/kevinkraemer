import type { ParentProps } from "solid-js"

export function CvSection(props: ParentProps<{ id: string }>) {
    return (
        <section id={props.id} class="animate-fade-up pt-2">
            {props.children}
        </section>
    )
}
