import { Stack } from "@ui/stack"
import { StackRow } from "@ui/stack-row"
import { Repeat } from "solid-js"

export function SearchSkeleton() {
    return (
        <Stack>
            <Repeat count={3}>
                {() => (
                    <StackRow>
                        <div class="h-4 w-2/3 animate-pulse bg-stone-200 dark:bg-stone-800" />
                        <div class="mt-2 h-3 w-full animate-pulse bg-stone-200/70 dark:bg-stone-800/70" />
                        <div class="mt-1 h-3 w-5/6 animate-pulse bg-stone-200/60 dark:bg-stone-800/60" />
                    </StackRow>
                )}
            </Repeat>
        </Stack>
    )
}
