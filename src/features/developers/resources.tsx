import { catalogEntries } from "@core/site/catalog"
import { CV_PDF_PATH, origin } from "@core/site/urls"
import { DevelopersLead } from "@features/developers/lead"
import { DevelopersProse } from "@features/developers/prose"
import { DocumentSection, SectionHeading } from "@pattern/section"
import { Stack, StackRow } from "@pattern/stack"
import { Anchor } from "@ui/anchor"
import { For } from "solid-js"

const RESOURCE_ENTRIES = catalogEntries.filter((entry) => entry.type !== "text/html" && entry.path !== CV_PDF_PATH)

export function DevelopersResources() {
    return (
        <DocumentSection aria-labelledby="resources-heading">
            <SectionHeading id="resources-heading">resources</SectionHeading>
            <Stack render={(renderProps) => <ul {...renderProps} />}>
                <For each={RESOURCE_ENTRIES}>
                    {(resource) => (
                        <StackRow render={(renderProps) => <li {...renderProps} />} class="grid gap-1.5">
                            <Anchor href={resource.path} variant="channel" rel="external" class="hit-area-y-2">
                                {resource.path}
                            </Anchor>
                            <DevelopersProse class="text-stone-600 dark:text-stone-400">
                                <DevelopersLead class="text-stone-600 dark:text-stone-400">
                                    {resource.type}
                                </DevelopersLead>{" "}
                                <span aria-hidden="true" class="mx-2 text-stone-400 dark:text-stone-400">
                                    /
                                </span>{" "}
                                {resource.description}
                            </DevelopersProse>
                        </StackRow>
                    )}
                </For>
            </Stack>
            <p class="mt-4 font-mono text-xs/relaxed text-stone-600 tabular-nums dark:text-stone-400">
                Canonical origin: <span class="text-stone-900 dark:text-stone-200">{origin}</span> All other origins
                redirect here.
            </p>
        </DocumentSection>
    )
}
