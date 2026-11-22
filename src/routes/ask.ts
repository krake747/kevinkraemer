import { createAsk } from "@core/ask/create-ask"
import { askDeps } from "@core/ask/deps"
import { tapeResult } from "@core/ask/tape-data"
import { createAskHandler } from "@features/ask/create-handler"

const handle = createAskHandler(
    createAsk({
        tape: tapeResult,
        env: { TYPESAFE_API_KEY: process.env.TYPESAFE_API_KEY, OPENAI_API_KEY: process.env.OPENAI_API_KEY },
        makeDeps: askDeps,
    }),
)

function respond(event: { request: Request }): Promise<Response> {
    return handle(event.request)
}

export const GET = respond
export const POST = respond
export const OPTIONS = respond
export const PUT = respond
export const DELETE = respond
export const PATCH = respond
