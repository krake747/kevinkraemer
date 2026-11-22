import type { GraphFlowSpec } from "@core/content/model"
import { LogGraphFlow } from "@features/log/graph-flow"
import { For, Show } from "solid-js"

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

export function LogBody(props: { html: string; graphs: GraphFlowSpec[]; class?: string }) {
    const segments = () => toSegments(props.html)

    return (
        <div class={props.class}>
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
