import { EmptyRegister, EmptyRegisterAction, EmptyRegisterNote, EmptyRegisterTitle } from "@pattern/register"
import { Button } from "@ui/button"
import type { VoidProps } from "solid-js"

export function CommandPaletteFailed(props: VoidProps<{ message: string; onRetry: () => void }>) {
    return (
        <EmptyRegister size="relaxed" announce="assertive">
            <EmptyRegisterTitle>$ grep: search failed</EmptyRegisterTitle>
            <EmptyRegisterNote>{props.message}</EmptyRegisterNote>
            <EmptyRegisterAction>
                <Button intent="link" onClick={() => props.onRetry()}>
                    retry
                </Button>
            </EmptyRegisterAction>
        </EmptyRegister>
    )
}
