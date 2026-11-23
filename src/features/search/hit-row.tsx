import type { SearchHit } from "@core/search/pagefind"
import { ArrowRight } from "@ui/icon"
import { StackRow } from "@ui/stack-row"
import type { VoidProps } from "solid-js"

export function SearchHitRow(props: VoidProps<{ hit: SearchHit }>) {
    return (
        <StackRow as="li" interactive class="flex items-start justify-between gap-4">
            <a href={props.hit.href} class="contents">
                <span class="min-w-0 flex-1">
                    <span class="block truncate font-semibold text-stone-900 transition-colors group-hover:text-emerald-800 dark:text-stone-100 dark:group-hover:text-emerald-400">
                        {props.hit.title}
                    </span>
                    <span class="mt-1 line-clamp-2 block text-sm/relaxed text-stone-600 dark:text-stone-400">
                        {props.hit.excerpt}
                    </span>
                    <span class="mt-2 block font-mono text-xs text-stone-600 dark:text-stone-400">
                        {props.hit.href}
                    </span>
                </span>
                <span
                    aria-hidden="true"
                    class="hidden shrink-0 items-center pt-1 text-stone-600 transition-colors group-hover:text-emerald-700 sm:inline-flex dark:text-stone-400 dark:group-hover:text-emerald-400"
                >
                    <ArrowRight class="size-4 transition-transform duration-150 ease-out-quart group-hover:pointer-fine:translate-x-1" />
                </span>
            </a>
        </StackRow>
    )
}
