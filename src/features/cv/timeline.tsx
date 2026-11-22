import { sortByOrder } from "@core/content/model"
import { siteContent } from "@core/content/site-content"
import { CvBullets } from "@features/cv/bullets"
import { CvDates } from "@features/cv/dates"
import { CvEntry } from "@features/cv/entry"
import { CvRole } from "@features/cv/role"
import { CvRowHeader } from "@features/cv/row-header"
import { Stack } from "@ui/stack"
import { StackRow } from "@ui/stack-row"
import { For } from "solid-js"

export function CvTimeline() {
    const experienceEntries = sortByOrder(siteContent.experience)

    return (
        <Stack>
            <For each={experienceEntries}>
                {(item) => (
                    <CvEntry current={item.endDate === null}>
                        <StackRow as="article" class="break-inside-avoid">
                            <CvRowHeader title={item.company} meta={item.location} />
                            <CvRole>{item.role}</CvRole>
                            <CvDates start={item.startDate} end={item.endDate} />
                            <CvBullets items={item.responsibilities} />
                        </StackRow>
                    </CvEntry>
                )}
            </For>
        </Stack>
    )
}
