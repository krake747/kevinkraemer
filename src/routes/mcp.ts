import { apiVersion } from "@core/site/api-version"
import { problemResponse } from "@core/site/problem"
import { createMcpHandler } from "@features/mcp/create-handler"

const methods = ["POST", "OPTIONS"]

const handle = createMcpHandler({
    TYPESAFE_API_KEY: process.env.TYPESAFE_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
})

function methodNotAllowed(): Response {
    return problemResponse(
        {
            status: 405,
            code: "METHOD_NOT_ALLOWED",
            detail: "MCP is a JSON-RPC protocol carried over POST.",
            hint: "Send a JSON-RPC message with POST and Accept: application/json, text/event-stream.",
        },
        { Allow: methods.join(", ") },
    )
}

async function respond(event: { request: Request }): Promise<Response> {
    const { request } = event
    if (!methods.includes(request.method)) {
        return methodNotAllowed()
    }

    const response = await handle(request)
    const headers = new Headers(response.headers)
    headers.set("Access-Control-Allow-Origin", "*")
    headers.set("API-Version", apiVersion)

    return new Response(response.body, { status: response.status, headers })
}

export const POST = respond
export const OPTIONS = respond
export const GET = respond
export const PUT = respond
export const DELETE = respond
export const PATCH = respond
