import { answerWith } from "@core/ask/answer"
import { runAsk, type AskAnswer, type AskDeps } from "@core/ask/ask"
import type { AskError, AskTapeBroken } from "@core/ask/errors"
import { judgeWith } from "@core/ask/gate"
import { getAskKeys, type AskKeys } from "@core/ask/keys"
import { parseAskRequest } from "@core/ask/request"
import type { TapeFile } from "@core/ask/tape"
import { Result } from "better-result"

export type Ask = (input: unknown, signal: AbortSignal) => Promise<Result<AskAnswer, AskError>>

function askDeps(keys: AskKeys): AskDeps {
    return { judge: judgeWith(keys.typesafeApiKey), answer: answerWith(keys.openaiApiKey) }
}

type CreateAskOptions = {
    tape: Result<TapeFile, AskTapeBroken>
    env: unknown
    makeDeps?: (keys: AskKeys) => AskDeps
}

export function createAsk({ tape, env, makeDeps = askDeps }: CreateAskOptions): Ask {
    return (input, signal) =>
        Result.gen(async function* () {
            const parsed = yield* parseAskRequest(input)
            const keys = yield* getAskKeys(env)
            const file = yield* tape
            const answer = yield* Result.await(
                runAsk(makeDeps(keys))(parsed.question, parsed.summarize, file.prints, signal),
            )
            return Result.ok(answer)
        })
}
