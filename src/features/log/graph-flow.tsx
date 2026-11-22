import { namedFlows, type FlowName, type FlowStep } from "@core/content/graphs"
import type { GraphFlowSpec } from "@core/content/model"
import { For } from "solid-js"

type Lane = {
    caption: string
    steps: FlowStep[]
}

const LANE_CAPTION: Record<FlowName, string> = { chain: "HANDOFF CHAIN", now: "SLICE MODEL" }

function toLane(name: FlowName): Lane {
    return { caption: LANE_CAPTION[name], steps: namedFlows[name] }
}

function lanesFor(spec: GraphFlowSpec): Lane[] {
    if (spec.kind === "single") {
        return [{ caption: spec.title, steps: namedFlows[spec.flow] }]
    }
    return [spec.flow, spec.compare, spec.third].filter((name): name is FlowName => name !== undefined).map(toLane)
}

function gridClass(spec: GraphFlowSpec): string {
    if (spec.kind === "single") {
        return "grid grid-cols-1 gap-8"
    }
    return spec.third === undefined
        ? "grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-4"
        : "grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-4"
}

export function LogGraphFlow(props: { spec: GraphFlowSpec }) {
    return (
        <figure class="not-prose relative my-8 graph-frame font-mono text-sm/6" aria-label={props.spec.title}>
            <div
                class="absolute top-0 left-1/2 z-10 w-max -translate-x-1/2 -translate-y-1/2 bg-stone-50 px-3 text-xs tracking-widest text-(--graph-accent) dark:bg-stone-950"
                aria-hidden="true"
            >
                [ {props.spec.title} ]
            </div>
            <span
                aria-hidden="true"
                class="pointer-events-none absolute top-0 left-0 z-10 flex size-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-stone-50 font-mono text-sm/none text-(--graph-muted) dark:bg-stone-950"
            >
                +
            </span>
            <span
                aria-hidden="true"
                class="pointer-events-none absolute top-0 right-0 z-10 flex size-4 translate-x-1/2 -translate-y-1/2 items-center justify-center bg-stone-50 font-mono text-sm/none text-(--graph-muted) dark:bg-stone-950"
            >
                +
            </span>
            <div class="px-4 py-6 sm:px-6">
                <div class={gridClass(props.spec)}>
                    <For each={lanesFor(props.spec)}>
                        {(lane) => (
                            <div class="flex flex-col items-center">
                                {props.spec.kind === "compare" ? (
                                    <span class="mb-3 w-full translate-x-[0.05em] text-center text-[11px] tracking-widest text-(--graph-accent)">
                                        {lane.caption}
                                    </span>
                                ) : null}
                                <ol class="m-0 flex list-none flex-col items-center gap-0 p-0">
                                    <For each={lane.steps}>
                                        {(step, index) => (
                                            <>
                                                <li class="flex flex-col items-center">
                                                    <span class="border border-dashed border-(--graph-frame) px-4 py-1.5 text-stone-800 dark:border-stone-600 dark:text-stone-100">
                                                        {step.label}
                                                    </span>
                                                    {step.sub ? (
                                                        <span class="mt-1 text-xs text-stone-500 dark:text-stone-400">
                                                            {step.sub}
                                                        </span>
                                                    ) : null}
                                                </li>
                                                {index() < lane.steps.length - 1 ? (
                                                    <li class="flex flex-col items-center py-1" aria-hidden="true">
                                                        <span class="h-5 w-px border-l border-dashed border-(--graph-accent)" />
                                                        <span class="text-[11px]/none text-(--graph-accent)">▼</span>
                                                    </li>
                                                ) : null}
                                            </>
                                        )}
                                    </For>
                                </ol>
                            </div>
                        )}
                    </For>
                </div>
            </div>
            <span
                class="pointer-events-none absolute bottom-0 left-0 z-10 flex size-4 -translate-x-1/2 translate-y-1/2 items-center justify-center bg-stone-50 font-mono text-sm/none text-(--graph-muted) dark:bg-stone-950"
                aria-hidden="true"
            >
                +
            </span>
            <span
                class="pointer-events-none absolute right-0 bottom-0 z-10 flex size-4 translate-x-1/2 translate-y-1/2 items-center justify-center bg-stone-50 font-mono text-sm/none text-(--graph-muted) dark:bg-stone-950"
                aria-hidden="true"
            >
                +
            </span>
        </figure>
    )
}
