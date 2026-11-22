import { runAsk, type AskDeps, type AskAnswer } from "@core/ask/ask"
import type { AskTapeBroken, AskError } from "@core/ask/errors"
import { getAskKeys, type AskKeys } from "@core/ask/keys"
import { parseAskRequest } from "@core/ask/request"
import type { TapeFile } from "@core/ask/tape"
import { Result } from "better-result"

export type Ask = (input: unknown, signal: AbortSignal) => Promise<Result<AskAnswer, AskError>>

type CreateAskOptions = {
    tape: Result<TapeFile, AskTapeBroken>
    env: unknown
    makeDeps: (keys: AskKeys) => AskDeps
}

export function createAsk({ tape, env, makeDeps }: CreateAskOptions): Ask {
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
