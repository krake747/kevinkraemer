import type { JSX } from "@solidjs/web"
import { cx } from "@ui/cva.config"

export function DevelopersProse(props: { children?: JSX.Element; class?: string }) {
    return (
        <p class={cx("max-w-prose text-sm/relaxed text-stone-700 dark:text-stone-300", props.class)}>
            {props.children}
        </p>
    )
}
