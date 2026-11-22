import type { GraphFlowSpec } from "@core/content/model"
import { LogGraphFlow } from "@features/log/graph-flow"
import type { ComponentProps } from "@solidjs/web"
import { For, omit, Show } from "solid-js"

type Segment = { kind: "html"; html: string } | { kind: "graph"; slot: number }

const SLOT = /<div data-graph-slot="(\d+)"><\/div>/g

function toSegments(html: string): Segment[] {
    const segments: Segment[] = []
    let cursor = 0

    for (const match of html.matchAll(SLOT)) {
        const matchStart = match.index
        if (matchStart > cursor) {
            segments.push({ kind: "html", html: html.slice(cursor, matchStart) })
        }
        segments.push({ kind: "graph", slot: Number(match[1]) })
        cursor = matchStart + match[0].length
    }

    if (cursor < html.length) {
        segments.push({ kind: "html", html: html.slice(cursor) })
    }

    return segments
}

export function LogBody(props: ComponentProps<"div"> & { html: string; graphs: GraphFlowSpec[] }) {
    const rest = omit(props, "html", "graphs", "class", "children")
    const segments = () => toSegments(props.html)

    return (
        <div {...rest} class={props.class}>
            <For each={segments()}>
                {(segment) =>
                    segment.kind === "graph" ? (
                        <Show when={props.graphs[segment.slot]}>{(spec) => <LogGraphFlow spec={spec()} />}</Show>
                    ) : (
                        <div innerHTML={segment.html} />
                    )
                }
            </For>
        </div>
    )
}
