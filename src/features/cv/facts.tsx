import type { ParentProps } from "solid-js"

export function CvFacts(props: ParentProps) {
    return <div class="grid gap-x-8 gap-y-3 sm:grid-cols-2">{props.children}</div>
}
