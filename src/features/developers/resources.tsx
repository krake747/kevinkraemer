import { catalogEntries } from "@core/site/catalog"
import { CV_PDF_PATH, origin } from "@core/site/urls"
import { Anchor } from "@ui/anchor"
import { SectionHeading } from "@ui/section-heading"
import { Stack } from "@ui/stack"
import { StackRow } from "@ui/stack-row"
import { For } from "solid-js"

const RESOURCE_ENTRIES = catalogEntries.filter((entry) => entry.type !== "text/html" && entry.path !== CV_PDF_PATH)

export function DevelopersResources() {
    return (
        <section aria-labelledby="resources-heading">
            <SectionHeading id="resources-heading">resources</SectionHeading>
            <Stack as="ul">
                <For each={RESOURCE_ENTRIES}>
                    {(resource) => (
                        <StackRow as="li" class="grid gap-1.5">
                            <Anchor href={resource.path} variant="channel" rel="external" class="hit-area-y-2">
                                {resource.path}
                            </Anchor>
                            <p class="max-w-prose text-sm/relaxed text-stone-600 dark:text-stone-400">
                                <span class="font-mono text-xs text-stone-600 dark:text-stone-400">
                                    {resource.type}
                                </span>{" "}
                                <span aria-hidden="true" class="mx-2 text-stone-400 dark:text-stone-400">
                                    /
                                </span>{" "}
                                {resource.description}
                            </p>
                        </StackRow>
                    )}
                </For>
            </Stack>
            <p class="mt-4 font-mono text-xs/relaxed text-stone-600 tabular-nums dark:text-stone-400">
                Canonical origin: <span class="text-stone-900 dark:text-stone-200">{origin}</span> All other origins
                redirect here.
            </p>
        </section>
    )
}
