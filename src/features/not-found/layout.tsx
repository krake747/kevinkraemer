import type { ParentProps } from "solid-js"

export function NotFoundLayout(props: ParentProps) {
    return (
        <div class="flex flex-1 items-center justify-center px-4 sm:px-6">
            <div class="text-center kk-cascade [--kk-cascade-step:20ms]">{props.children}</div>
        </div>
    )
}
