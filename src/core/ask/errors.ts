import { TaggedError } from "better-result"

export class AskInvalidRequest extends TaggedError("AskInvalidRequest")<{
    message: string
    issues: unknown
}> {}

export class AskKeysMissing extends TaggedError("AskKeysMissing")<{
    message: string
}> {}

export class AskTapeBroken extends TaggedError("AskTapeBroken")<{
    message: string
}> {}

export class AskUnsupported extends TaggedError("AskUnsupported")<{
    message: string
}> {}

export class AskMalformedResponse extends TaggedError("AskMalformedResponse")<{
    message: string
    page: string
}> {}

export class AskUpstream extends TaggedError("AskUpstream")<{
    message: string
    cause: unknown
}> {}

export type AskError =
    | AskInvalidRequest
    | AskKeysMissing
    | AskTapeBroken
    | AskUnsupported
    | AskMalformedResponse
    | AskUpstream
