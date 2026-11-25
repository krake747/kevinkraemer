import { sortByOrder, type EmploymentPeriod, type ExperienceEntry } from "@core/content/model"
import { siteContent } from "@core/content/site-content"
import { CvBullets } from "@features/cv/bullets"
import { CvDates } from "@features/cv/dates"
import { CvEntry } from "@features/cv/entry"
import { CvRole } from "@features/cv/role"
import { CvRowHeader } from "@features/cv/row-header"
import { CvSection } from "@features/cv/section"
import { CvSectionHeading } from "@features/cv/section-heading"
import { Stack, StackRow } from "@pattern/stack"
import { For, type VoidProps } from "solid-js"

const EXPERIENCE_ENTRIES = sortByOrder(siteContent.experience)

function toPeriod(item: ExperienceEntry): EmploymentPeriod {
    if (item.endDate === null) {
        return { kind: "current", start: item.startDate }
    }
    return { kind: "past", start: item.startDate, end: item.endDate }
}

export function CvExperience(props: VoidProps<{ id: string }>) {
    return (
        <CvSection id={props.id}>
            <CvSectionHeading>Experience</CvSectionHeading>
            <Stack>
                <For each={EXPERIENCE_ENTRIES}>
                    {(item) => {
                        const period = toPeriod(item)
                        return (
                            <CvEntry period={period}>
                                <StackRow
                                    render={(renderProps) => <article {...renderProps} />}
                                    class="break-inside-avoid"
                                >
                                    <CvRowHeader title={item.company} meta={item.location} />
                                    <CvRole>{item.role}</CvRole>
                                    <CvDates period={period} />
                                    <CvBullets items={item.responsibilities} />
                                </StackRow>
                            </CvEntry>
                        )
                    }}
                </For>
            </Stack>
        </CvSection>
    )
}
