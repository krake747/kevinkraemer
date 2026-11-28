import { askRequestSchema } from "@core/ask/request"
import { toStandardJsonSchema } from "@valibot/to-json-schema"

export const mcpAskInputSchema = toStandardJsonSchema(askRequestSchema)
