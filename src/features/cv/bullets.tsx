import { useCvEntryCurrent } from "@features/cv/entry"
import { cva, type VariantProps } from "@ui/cva.config"
import { For, createMemo, type VoidProps } from "solid-js"

const bulletMark = cva({
    base: "font-mono",
    variants: {
        tone: {
            active: "text-emerald-600 dark:text-emerald-400",
            muted: "text-stone-600 dark:text-stone-400",
        },
    },
})

export function CvBullets(props: VoidProps<{ items: string[]; tone?: VariantProps<typeof bulletMark>["tone"] }>) {
    const isCurrent = useCvEntryCurrent()
    const tone = createMemo(() => bulletMark({ tone: props.tone ?? (isCurrent() ? "active" : "muted") }))
    return (
        <ul class="mt-2 flex flex-col gap-1">
            <For each={props.items}>
                {(item) => (
                    <li class="flex items-start gap-2 text-sm text-pretty">
                        <span class={tone()}>#</span>
                        <span class="text-stone-600 dark:text-stone-400">{item}</span>
                    </li>
                )}
            </For>
        </ul>
    )
}
