import type { FlowStep } from "@core/content/graphs"

const democratizationChain: FlowStep[] = [
    { label: "Stakeholder", sub: "we need X" },
    { label: "PM", sub: "ticket" },
    { label: "Designer", sub: "mockups" },
    { label: "Developer", sub: "code" },
    { label: "Product" },
]

const requestFlowNow: FlowStep[] = [
    { label: "Stakeholder", sub: "we need X" },
    { label: "Specialists", sub: "input on request, no gate" },
    { label: "Slice owner", sub: "one request, end to end" },
    { label: "Agents", sub: "design, code, tests" },
    { label: "Product" },
]

export const namedFlows = {
    chain: democratizationChain,
    now: requestFlowNow,
} as const

export type FlowName = keyof typeof namedFlows

export function isFlowName(value: string | undefined): value is FlowName {
    return value !== undefined && Object.hasOwn(namedFlows, value)
}
