import { EmptyRegister, EmptyRegisterNote, EmptyRegisterTitle } from "@pattern/register"
import { Anchor } from "@ui/anchor"
import { InlineCode } from "@ui/inline-code"

export function SearchUnavailable() {
    return (
        <EmptyRegister size="relaxed" announce="polite">
            <EmptyRegisterTitle>Search index unavailable.</EmptyRegisterTitle>
            <EmptyRegisterNote>
                Build the site first: <InlineCode>pnpm build</InlineCode> then <InlineCode>pnpm preview</InlineCode> or{" "}
                <InlineCode>pnpm dev:search</InlineCode>. Or browse{" "}
                <Anchor href="/logs" variant="prose">
                    ~/logs
                </Anchor>{" "}
                directly.
            </EmptyRegisterNote>
        </EmptyRegister>
    )
}
