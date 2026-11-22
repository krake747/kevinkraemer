import type { LogEntry } from "@core/content/model"
import { stackRow } from "@ui/stack-row"

const BY_ID = new Intl.Collator("en-US")

const escapeHtml = (value: string): string =>
    value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;")

export function LogNoScript(props: { entries: LogEntry[] }) {
    const html = () =>
        [
            '<ul class="flex flex-col gap-4">',
            ...props.entries
                .toSorted((a, b) => BY_ID.compare(a.id, b.id))
                .map(
                    (entry) =>
                        `<li class="${stackRow()}"><a href="/logs/${entry.id}" class="font-semibold text-stone-900 dark:text-stone-100">${escapeHtml(entry.title)}</a><p class="mt-1 text-sm text-stone-600 dark:text-stone-400">${escapeHtml(entry.description)}</p></li>`,
                ),
            "</ul>",
            `<p class="mt-6 font-mono text-xs text-stone-600 dark:text-stone-400">rss: <a href="/rss.xml" class="text-emerald-800 underline decoration-emerald-500/30 underline-offset-2 dark:text-emerald-400">/rss.xml</a></p>`,
        ].join("")

    return <noscript innerHTML={html()} />
}
