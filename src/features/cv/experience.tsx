import { sortByOrder } from "@core/content/model"
import { siteContent } from "@core/content/site-content"
import { CvBullets } from "@features/cv/bullets"
import { CvDates } from "@features/cv/dates"
import { CvEntry } from "@features/cv/entry"
import { CvRole } from "@features/cv/role"
import { CvRowHeader } from "@features/cv/row-header"
import { CvSection } from "@features/cv/section"
import { CvSectionHeading } from "@features/cv/section-heading"
import { Stack } from "@ui/stack"
import { StackRow } from "@ui/stack-row"
import { For, type VoidProps } from "solid-js"

export function CvExperience(props: VoidProps<{ id: string }>) {
    const experienceEntries = sortByOrder(siteContent.experience)

    return (
        <CvSection id={props.id}>
            <CvSectionHeading>Experience</CvSectionHeading>
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
        </CvSection>
    )
}
