import { parseTapeFile } from "@core/ask/request"
import { tape as generated } from "@generated/tape"

export const tapeResult = parseTapeFile(generated)
