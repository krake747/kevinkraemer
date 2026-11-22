import { CvEducation } from "@features/cv/education"
import { CvHeader } from "@features/cv/header"
import { CvLastUpdated } from "@features/cv/last-updated"
import { CvProjects } from "@features/cv/projects"
import { CvSection } from "@features/cv/section"
import { CvSkills } from "@features/cv/skills"
import { CvSummary } from "@features/cv/summary"
import { CvTimeline } from "@features/cv/timeline"
import { PageShell } from "@pattern/page-shell"
import { Anchor } from "@ui/anchor"
import { TerminalCommandHeader } from "@ui/terminal-command-header"

export function CvPage() {
    return (
        <PageShell class="print:py-8">
            <div class="mx-auto flex max-w-4xl flex-col gap-10 kk-cascade">
                <header class="animate-rise">
                    <TerminalCommandHeader command="cd ~/cv" class="mb-4 print:hidden" />
                    <CvHeader />
                </header>

                <CvSummary />

                <CvSection id="experience" heading="Experience">
                    <CvTimeline />
                </CvSection>

                <CvSection id="skills" heading="Technical Skills">
                    <CvSkills />
                </CvSection>

                <CvSection
                    id="projects"
                    heading={
                        <Anchor href="/projects" variant="muted" class="text-xs">
                            Projects
                        </Anchor>
                    }
                >
                    <CvProjects />
                </CvSection>

                <CvSection id="education" heading="Education">
                    <CvEducation />
                </CvSection>

                <CvLastUpdated />
            </div>
        </PageShell>
    )
}
