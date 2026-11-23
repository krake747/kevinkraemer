import { makePersonSchema } from "@core/site/jsonld"
import { canonicalFor } from "@core/site/urls"
import { CvEducation } from "@features/cv/education"
import { CvExperience } from "@features/cv/experience"
import { CvHeader } from "@features/cv/header"
import { CvProjects } from "@features/cv/projects"
import { CvSkills } from "@features/cv/skills"
import { CvSummary } from "@features/cv/summary"
import { PageShell } from "@pattern/page-shell"
import { Seo } from "@pattern/seo"

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
            <PageShell class="print:py-8">
                <div class="mx-auto flex max-w-4xl flex-col gap-10 kk-cascade">
                    <CvHeader />
                    <CvSummary />
                    <CvExperience />
                    <CvSkills />
                    <CvProjects />
                    <CvEducation />
                </div>
            </PageShell>
        </>
    )
}
