import { site } from "@core/site/site-meta"
import { CV_PDF_PATH } from "@core/site/urls"
import { TerminalCommandHeader } from "@pattern/terminal"
import { Anchor } from "@ui/anchor"
import { Badge } from "@ui/badge"

const CV_NAME = "Kevin Kraemer"

const CV_CONTACT = {
    email: site.email,
    github: "krake747",
}

export function CvHeader() {
    return (
        <div class="animate-rise">
            <TerminalCommandHeader command="cd ~/cv" class="mb-4 print:hidden" />
            <header>
                <div class="flex flex-col gap-1">
                    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <h1 class="text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                            {CV_NAME}
                        </h1>
                        <Badge
                            tone="emerald"
                            interactive
                            class="w-fit"
                            target={{ kind: "external" }}
                            render={(renderProps) => (
                                <a {...renderProps} href="https://www.simpleip.com">
                                    {renderProps.children}
                                </a>
                            )}
                        >
                            Building @ Simple IP
                        </Badge>
                    </div>
                    <p class="font-mono text-sm text-stone-600 dark:text-stone-400">Full-Stack Developer</p>
                    <p class="font-mono text-xs text-stone-600 dark:text-stone-400">Former Risk Analyst</p>
                    <div class="flex flex-col gap-2 pt-2 font-mono text-sm sm:flex-row sm:items-center sm:gap-3 sm:pt-0">
                        <Anchor href={`mailto:${CV_CONTACT.email}`} variant="mono" class="hit-area-y-3">
                            {CV_CONTACT.email}
                        </Anchor>
                        <span class="hidden text-stone-300 sm:inline dark:text-stone-600">·</span>
                        <Anchor
                            href={`https://github.com/${CV_CONTACT.github}`}
                            variant="muted"
                            target={{ kind: "external" }}
                            class="hit-area-y-3"
                        >
                            github.com/{CV_CONTACT.github}
                        </Anchor>
                        <span class="hidden text-stone-300 sm:inline dark:text-stone-600">·</span>
                        <Anchor
                            href={CV_PDF_PATH}
                            variant="muted"
                            download
                            rel="external"
                            aria-label="Download CV as PDF"
                            class="hit-area-y-3"
                        >
                            PDF
                        </Anchor>
                    </div>
                </div>
            </header>
        </div>
    )
}
