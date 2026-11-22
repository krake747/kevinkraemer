import { cx } from "@ui/cva.config"

export function DevelopersIndex(props: { index: number; class?: string }) {
    return (
        <span
            aria-hidden="true"
            class={cx("font-mono text-xs text-stone-400 tabular-nums dark:text-stone-600", props.class)}
        >
            {String(props.index + 1).padStart(2, "0")}
        </span>
    )
}
