import { makePersonSchema } from "@core/site/jsonld"
import { canonicalFor } from "@core/site/urls"
import { CvEducation } from "@features/cv/education"
import { CvExperience } from "@features/cv/experience"
import { CvHeader } from "@features/cv/header"
import { CvProjects } from "@features/cv/projects"
import { CvSkills } from "@features/cv/skills"
import { CvSummary } from "@features/cv/summary"
import { PageShell } from "@pattern/page-shell"
import { PageSections, type SectionLink } from "@pattern/section-nav"
import { Seo } from "@pattern/seo"

const SECTION_LINKS: SectionLink[] = [
    { label: "#experience", href: "/cv#experience" },
    { label: "#skills", href: "/cv#skills" },
    { label: "#projects", href: "/cv#projects" },
    { label: "#education", href: "/cv#education" },
]

export default function CvRoute() {
    const canonical = canonicalFor("/cv")

    return (
        <>
            <Seo
                title="CV"
                description="Full-stack developer. Former financial risk analyst building modern web applications with React, TypeScript, Go, and cloud-native technologies."
                path="/cv"
                extraSchemas={[makePersonSchema(canonical)]}
            />
            <PageSections links={SECTION_LINKS} />
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
