import { siteContent } from "@core/content/site-content"
import { resolveLogDetail } from "@features/log/detail"
import { LogEntry } from "@features/log/entry"
import { LogNotFound } from "@features/log/not-found"
import { sectionTrail, DetailShell } from "@pattern/detail-shell"
import { BreadcrumbSchema } from "@pattern/seo"
import { type RouteProps } from "@solidjs/router"
import { defineFileRoute } from "@solidjs/router/fs"
import { Show, createMemo } from "solid-js"

import "@features/log/prose.css"

export const route = defineFileRoute("/logs/:slug")

export default function LogRoute(props: RouteProps<typeof route>) {
    const detail = createMemo(() => resolveLogDetail(siteContent.logs, props.params.slug))

    return (
        <Show when={detail()} fallback={<LogNotFound />}>
            {(found) => {
                const entry = () => found().entry
                return (
                    <DetailShell
                        seo={{
                            title: `${entry().title} · Logs`,
                            description: entry().description,
                            path: `/logs/${entry().id}`,
                            type: "article",
                            publishedTime: entry().date,
                            tags: entry().tags,
                        }}
                    >
                        <BreadcrumbSchema items={sectionTrail("Logs", "/logs", entry().title)} />
                        <LogEntry detail={found()} />
                    </DetailShell>
                )
            }}
        </Show>
    )
}
