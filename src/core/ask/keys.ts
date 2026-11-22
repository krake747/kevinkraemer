import { AskKeysMissing } from "@core/ask/errors"
import { Result } from "better-result"
import * as v from "valibot"

export type AskKeys = {
    typesafeApiKey: string
    openaiApiKey: string
}

const AskKeysSchema = v.object({
    TYPESAFE_API_KEY: v.pipe(v.string(), v.minLength(1), v.description("Typesafe key for the fast decision gate")),
    OPENAI_API_KEY: v.pipe(v.string(), v.minLength(1), v.description("OpenAI key for answer synthesis")),
})

export function getAskKeys(env: unknown): Result<AskKeys, AskKeysMissing> {
    const parsed = v.safeParse(AskKeysSchema, env)
    if (!parsed.success) {
        return Result.err(new AskKeysMissing({ message: "TYPESAFE_API_KEY or OPENAI_API_KEY is not set" }))
    }
    return Result.ok({
        typesafeApiKey: parsed.output.TYPESAFE_API_KEY,
        openaiApiKey: parsed.output.OPENAI_API_KEY,
    })
}
