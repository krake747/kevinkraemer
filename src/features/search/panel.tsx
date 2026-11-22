import { cx } from "@ui/cva.config"
import type { ParentProps } from "solid-js"

export function SearchPanelTitle(props: ParentProps) {
    return <p class="font-mono text-sm text-stone-700 dark:text-stone-300">{props.children}</p>
}

export function SearchPanelNote(props: ParentProps<{ class?: string }>) {
    return <p class={cx("font-mono text-xs text-stone-600 dark:text-stone-400", props.class)}>{props.children}</p>
}

export function SearchPanelEmphasis(props: ParentProps) {
    return <span class="text-stone-900 dark:text-stone-100">{props.children}</span>
}
