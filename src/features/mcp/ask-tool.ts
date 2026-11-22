import type { Ask } from "@core/ask/create-ask"
import { askProblem } from "@core/ask/problem"
import type { AskRequestInput } from "@core/ask/request"

type ToolText = {
    type: "text"
    text: string
}

export type AskToolResult = {
    content: ToolText[]
    isError?: boolean
}

function text(value: string): ToolText {
    return { type: "text", text: value }
}

export function createAskTool(ask: Ask) {
    return async (args: AskRequestInput, signal: AbortSignal): Promise<AskToolResult> => {
        const result = await ask(args, signal)
        return result.match({
            ok: (answer) => ({ content: [text(JSON.stringify(answer))] }),
            err: (error) => ({ content: [text(askProblem(error).detail)], isError: true }),
        })
    }
}
