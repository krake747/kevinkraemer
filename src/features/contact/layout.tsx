import type { JSX } from "@solidjs/web"

export function ContactLayout(props: { children?: JSX.Element }) {
    return <div class="flex flex-col gap-10">{props.children}</div>
}
