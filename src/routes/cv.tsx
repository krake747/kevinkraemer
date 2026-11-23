import { CvEducation } from "@features/cv/education"
import { CvExperience } from "@features/cv/experience"
import { CvHeader } from "@features/cv/header"
import { CvProjects } from "@features/cv/projects"
import { CvSkills } from "@features/cv/skills"
import { CvSummary } from "@features/cv/summary"
import { PageShell } from "@pattern/page-shell"
import { Seo } from "@pattern/seo"
import { defineFileRoute } from "@solidjs/router/fs"

const SECTION_LINKS = [
    { label: "#experience", href: "/cv#experience" },
    { label: "#skills", href: "/cv#skills" },
    { label: "#projects", href: "/cv#projects" },
    { label: "#education", href: "/cv#education" },
] as const

export const route = defineFileRoute("/cv", { info: { sections: [...SECTION_LINKS] } })

export default function CvRoute() {
    return (
        <>
            <Seo
                title="CV"
                description="Full-stack developer. Former financial risk analyst building modern web applications with React, TypeScript, Go, and cloud-native technologies."
                path="/cv"
            />
            <PageShell class="print:py-8">
                <div class="mx-auto flex max-w-4xl flex-col gap-10 kk-cascade">
                    <CvHeader />
                    <CvSummary />
                    <CvExperience id="experience" />
                    <CvSkills id="skills" />
                    <CvProjects id="projects" />
                    <CvEducation id="education" />
                </div>
            </PageShell>
        </>
    )
}
