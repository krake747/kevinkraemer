import { CvBullets } from "@features/cv/bullets"
import { CvDates } from "@features/cv/dates"
import { CvRole } from "@features/cv/role"
import { CvRowHeader } from "@features/cv/row-header"
import { CvSection } from "@features/cv/section"
import { CvSectionHeading } from "@features/cv/section-heading"
import { Stack } from "@ui/stack"
import { StackRow } from "@ui/stack-row"
import { For } from "solid-js"

type Education = {
    institution: string
    degree: string
    startDate: string
    endDate: string
    location: string
    details?: string[]
}

const EDUCATION_ENTRIES: Education[] = [
    {
        institution: "University of Innsbruck",
        degree: "Master of Science in Banking & Finance",
        startDate: "Oct 2017",
        endDate: "Jun 2019",
        location: "Innsbruck, Austria",
        details: [
            "MSc Thesis: Institutional Stock Attention. Low Attention High Alpha",
            "Behavioural Finance, Experimental Finance, Asset Management",
        ],
    },
    {
        institution: "University of Innsbruck",
        degree: "Bachelor of Science in Management & Economics",
        startDate: "Oct 2013",
        endDate: "Feb 2017",
        location: "Innsbruck, Austria",
        details: ["BSc Thesis: The Performance of Technical Trading Strategies", "Banking, Finance, Risk Management"],
    },
    {
        institution: "Lycée Michel-Rodange",
        degree: "Natural Sciences - Mathematics",
        startDate: "2007",
        endDate: "2013",
        location: "Hollerich, Luxembourg",
        details: [],
    },
]

export function CvEducation(props: { id: string }) {
    return (
        <CvSection id={props.id}>
            <CvSectionHeading>Education</CvSectionHeading>
            <Stack>
                <For each={EDUCATION_ENTRIES}>
                    {(item) => (
                        <StackRow as="article" class="break-inside-avoid">
                            <CvRowHeader title={item.institution} meta={item.location} />
                            <CvRole>{item.degree}</CvRole>
                            <CvDates start={item.startDate} end={item.endDate} separator="to" />
                            {item.details !== undefined && item.details.length > 0 ? (
                                <CvBullets items={item.details} />
                            ) : null}
                        </StackRow>
                    )}
                </For>
            </Stack>
        </CvSection>
    )
}
