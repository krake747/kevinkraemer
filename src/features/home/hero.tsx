import { HomeHeroContact } from "@features/home/hero-contact"
import { HomeHeroName } from "@features/home/hero-name"
import { PageFrame } from "@pattern/page-frame"
import { SectionHeading } from "@ui/section-heading"
import { TerminalCommandHeader } from "@ui/terminal-command-header"

export function HomeHero() {
    return (
        <PageFrame as="section" class="hero-intro min-h-[90dvh]">
            <div class="mx-auto max-w-6xl">
                <div class="mb-12 animate-fade-up [animation-delay:0ms]">
                    <TerminalCommandHeader command="whoami" />
                </div>
                <div class="overflow-hidden">
                    <HomeHeroName />
                </div>
                <div class="mt-8 md:mt-12">
                    <p class="font-mono text-sm text-stone-600 md:text-base dark:text-stone-400">
                        Full-stack developer in Luxembourg
                    </p>
                    <p class="mt-1 font-mono text-sm text-stone-600 dark:text-stone-400">
                        ex-risk analyst. The tools were more fun.
                    </p>
                </div>
                <div class="mt-16">
                    <SectionHeading id="hero-about-heading">about.txt</SectionHeading>
                    <div class="mt-4">
                        <p class="max-w-prose text-base/[1.8] text-stone-600 md:text-lg dark:text-stone-400">
                            I got into code the lazy way: too many Excel assignments at university, so I taught myself{" "}
                            <span class="text-stone-900 dark:text-stone-200">Python</span> to do them for me. At my
                            first job, there was lots of SQL and data, so I picked up{" "}
                            <span class="text-stone-900 dark:text-stone-200">C#</span> to process and analyse it.
                            Somewhere along the way the tools became more interesting than the job, and now building
                            software is the job. I still automate the boring parts first. Then I fuss over the two
                            pixels nobody can name but everybody feels.
                        </p>
                    </div>
                </div>
                <HomeHeroContact />
            </div>
        </PageFrame>
    )
}
