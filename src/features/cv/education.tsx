import { CvBullets } from "@features/cv/bullets"
import { CvDates } from "@features/cv/dates"
import { CvRole } from "@features/cv/role"
import { CvRowHeader, CvRowHeaderMeta, CvRowHeaderTitle } from "@features/cv/row-header"
import { CvSection } from "@features/cv/section"
import { CvSectionHeading } from "@features/cv/section-heading"
import { Stack, StackRow } from "@pattern/stack"
import { For, Show, type VoidProps } from "solid-js"

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

export function CvEducation(props: VoidProps<{ id: string }>) {
    return (
        <CvSection id={props.id}>
            <CvSectionHeading>Education</CvSectionHeading>
            <Stack>
                <For each={EDUCATION_ENTRIES}>
                    {(item) => (
                        <StackRow render={(renderProps) => <article {...renderProps} />} class="break-inside-avoid">
                            <CvRowHeader>
                                <CvRowHeaderTitle>{item.institution}</CvRowHeaderTitle>
                                <CvRowHeaderMeta>{item.location}</CvRowHeaderMeta>
                            </CvRowHeader>
                            <CvRole>{item.degree}</CvRole>
                            <CvDates
                                period={{ kind: "past", start: item.startDate, end: item.endDate }}
                                separator="to"
                            />
                            <Show
                                when={item.details !== undefined && item.details.length > 0 ? item.details : undefined}
                            >
                                {(details) => <CvBullets items={details()} />}
                            </Show>
                        </StackRow>
                    )}
                </For>
            </Stack>
        </CvSection>
    )
}
