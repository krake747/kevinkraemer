import { openapiJson } from "@core/site/openapi"
import { json } from "@core/site/respond"

export function GET(): Response {
    return json(openapiJson)
}
