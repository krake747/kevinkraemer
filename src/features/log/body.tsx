import type { GraphFlowSpec } from "@core/content/model"
import { LogGraphFlow } from "@features/log/graph-flow"
import type { ComponentProps } from "@solidjs/web"
import { For, Match, Show, Switch, omit, type VoidProps } from "solid-js"

type Segment = { kind: "html"; html: string } | { kind: "graph"; slot: number }

const SLOT = /<div data-graph-slot="(\d+)"><\/div>/g

function matchStart(match: RegExpMatchArray): number {
    return match.index ?? 0
}

function matchEnd(match: RegExpMatchArray): number {
    return (match.index ?? 0) + match[0].length
}

function prefixSegment(html: string, from: number, to: number): Segment[] {
    if (to <= from) {
        return []
    }
    return [{ kind: "html", html: html.slice(from, to) }]
}

function toSegments(html: string): Segment[] {
    const matches = [...html.matchAll(SLOT)]
    const body = matches.flatMap((match, index): Segment[] => {
        const start = matchStart(match)
        const previous = matches[index - 1]
        const previousEnd = previous === undefined ? 0 : matchEnd(previous)
        return [...prefixSegment(html, previousEnd, start), { kind: "graph", slot: Number(match[1]) }]
    })
    const last = matches[matches.length - 1]
    const lastEnd = last === undefined ? 0 : matchEnd(last)
    return [...body, ...prefixSegment(html, lastEnd, html.length)]
}

export function LogBody(props: VoidProps<ComponentProps<"div"> & { html: string; graphs: GraphFlowSpec[] }>) {
    const rest = omit(props, "html", "graphs", "class", "children")
    const segments = () => toSegments(props.html)

    return (
        <div {...rest} class={props.class}>
            <For each={segments()}>
                {(segment) => (
                    <Switch>
                        <Match when={segment.kind === "graph" ? segment : undefined}>
                            {(graph) => (
                                <Show when={props.graphs[graph().slot]}>
                                    {(spec) => <LogGraphFlow spec={spec()} />}
                                </Show>
                            )}
                        </Match>
                        <Match when={segment.kind === "html" ? segment : undefined}>
                            {(html) => <div innerHTML={html().html} />}
                        </Match>
                    </Switch>
                )}
            </For>
        </div>
    )
}
