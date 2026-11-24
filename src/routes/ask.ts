import { createAsk } from "@core/ask/create-ask"
import { tapeResult } from "@core/ask/tape-data"
import { createAskHandler } from "@features/ask/create-handler"

const handle = createAskHandler(
    createAsk({
        tape: tapeResult,
        env: { TYPESAFE_API_KEY: process.env.TYPESAFE_API_KEY, OPENAI_API_KEY: process.env.OPENAI_API_KEY },
    }),
)

function respond(event: { request: Request }): Promise<Response> {
    return handle(event.request)
}

export const GET = respond
export const POST = respond
export const OPTIONS = respond
