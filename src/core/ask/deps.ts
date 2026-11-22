import { answerWith } from "@core/ask/answer"
import type { AskDeps } from "@core/ask/ask"
import { judgeWith } from "@core/ask/gate"
import type { AskKeys } from "@core/ask/keys"

export function askDeps(keys: AskKeys): AskDeps {
    return { judge: judgeWith(keys.typesafeApiKey), answer: answerWith(keys.openaiApiKey) }
}
