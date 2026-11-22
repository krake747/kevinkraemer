import { AskInvalidRequest, AskTapeBroken } from "@core/ask/errors"
import { TAPE_VERSION, TapeFileSchema, type TapeFile } from "@core/ask/tape"
import { Result } from "better-result"
import * as v from "valibot"

export const ASK_QUESTION_MIN_LENGTH = 1
export const ASK_QUESTION_MAX_LENGTH = 500

export const askRequestSchema = v.object({
    question: v.pipe(
        v.string(),
        v.minLength(ASK_QUESTION_MIN_LENGTH),
        v.maxLength(ASK_QUESTION_MAX_LENGTH),
        v.regex(/\S/),
        v.description("Plain-language question about Kevin, answered only from published content."),
    ),
    summarize: v.optional(
        v.pipe(
            v.boolean(),
            v.description("False returns matching pages only; true (default) also writes a prose answer."),
        ),
        true,
    ),
})

export type AskRequest = v.InferOutput<typeof askRequestSchema>

export type AskRequestInput = v.InferInput<typeof askRequestSchema>

export function parseAskRequest(value: unknown): Result<AskRequest, AskInvalidRequest> {
    const parsed = v.safeParse(askRequestSchema, value)
    if (!parsed.success) {
        return Result.err(new AskInvalidRequest({ message: "Invalid ask request", issues: parsed.issues }))
    }
    return Result.ok({ ...parsed.output, question: parsed.output.question.trim() })
}

export function parseTapeFile(value: unknown): Result<TapeFile, AskTapeBroken> {
    const parsed = v.safeParse(TapeFileSchema, value)
    if (!parsed.success) {
        return Result.err(new AskTapeBroken({ message: "Invalid tape file" }))
    }
    if (parsed.output.version !== TAPE_VERSION) {
        return Result.err(
            new AskTapeBroken({
                message: `Tape version ${parsed.output.version}, expected ${TAPE_VERSION}. Run pnpm generate.`,
            }),
        )
    }
    return Result.ok(parsed.output)
}
