import type { LogEntry } from "@core/content/model"
import { sortByDateDesc } from "@core/content/model"
import { escapeXml } from "@core/site/respond"
import { stackRow } from "@pattern/stack-row"
import type { VoidProps } from "solid-js"

export function LogNoScript(props: VoidProps<{ entries: LogEntry[] }>) {
    const html = () =>
        [
            '<ul class="flex flex-col gap-4">',
            ...sortByDateDesc(props.entries).map(
                (entry) =>
                    `<li class="${stackRow()}"><a href="/logs/${entry.id}" class="font-semibold text-stone-900 dark:text-stone-100">${escapeXml(entry.title)}</a><p class="mt-1 text-sm text-stone-600 dark:text-stone-400">${escapeXml(entry.description)}</p></li>`,
            ),
            "</ul>",
            `<p class="mt-6 font-mono text-xs text-stone-600 dark:text-stone-400">rss: <a href="/rss.xml" class="text-emerald-800 underline decoration-emerald-500/30 underline-offset-2 dark:text-emerald-400">/rss.xml</a></p>`,
        ].join("")

    return <noscript innerHTML={html()} />
}
