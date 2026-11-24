import { EmptyRegister } from "@pattern/register"
import { Button } from "@ui/button"
import type { VoidProps } from "solid-js"

export function SearchFailed(props: VoidProps<{ message: string; onRetry: () => void }>) {
    return (
        <EmptyRegister
            size="relaxed"
            title="Search failed."
            note={props.message}
            action={
                <Button intent="link" onClick={() => props.onRetry()}>
                    retry
                </Button>
            }
        />
    )
}
