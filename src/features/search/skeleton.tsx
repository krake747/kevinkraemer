import { Stack, StackRow } from "@pattern/stack"
import { Repeat } from "solid-js"

export function SearchSkeleton() {
    return (
        <Stack>
            <Repeat count={3}>
                {() => (
                    <StackRow>
                        <div class="h-4 w-2/3 bg-stone-200 motion-safe:animate-pulse dark:bg-stone-800" />
                        <div class="mt-2 h-3 w-full bg-stone-200/70 motion-safe:animate-pulse dark:bg-stone-800/70" />
                        <div class="mt-1 h-3 w-5/6 bg-stone-200/60 motion-safe:animate-pulse dark:bg-stone-800/60" />
                    </StackRow>
                )}
            </Repeat>
        </Stack>
    )
}
