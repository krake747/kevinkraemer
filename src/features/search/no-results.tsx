import { EmptyRegister, EmptyRegisterAction, EmptyRegisterNote, EmptyRegisterTitle } from "@pattern/register"
import { Anchor } from "@ui/anchor"
import { Button } from "@ui/button"
import type { VoidProps } from "solid-js"

export function SearchNoResults(props: VoidProps<{ query: string; onClear: () => void }>) {
    return (
        <EmptyRegister size="spacious">
            <EmptyRegisterTitle>
                <span class="text-stone-600 dark:text-stone-400">command not found:</span> {props.query}
            </EmptyRegisterTitle>
            <EmptyRegisterNote>
                No hits. Try a broader term, or browse{" "}
                <Anchor href="/logs" variant="prose">
                    ~/logs
                </Anchor>
                .
            </EmptyRegisterNote>
            <EmptyRegisterAction>
                <Button intent="link" onClick={() => props.onClear()}>
                    clear query
                </Button>
            </EmptyRegisterAction>
        </EmptyRegister>
    )
}
