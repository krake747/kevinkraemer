import type { JSX } from "@solidjs/web"
import { cx } from "@ui/cva.config"

export function DevelopersLead(props: { children?: JSX.Element; class?: string }) {
    return <span class={cx("font-mono text-xs text-stone-900 dark:text-stone-200", props.class)}>{props.children}</span>
}
