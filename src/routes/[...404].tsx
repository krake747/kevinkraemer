import { Seo } from "@pattern/seo"
import { useLocation } from "@solidjs/router"
import { httpStatus } from "@solidjs/web"
import { Anchor } from "@ui/anchor"
import { ChevronRight } from "@ui/icon"
import { TerminalCommandHeader } from "@ui/terminal-command-header"

export default function NotFoundRoute() {
    const location = useLocation()
    httpStatus(404)

    return (
        <main class="flex min-h-dvh items-center justify-center px-4 sm:px-6">
            <Seo
                title="404 · Page Not Found"
                description="The page you are looking for does not exist."
                robots="noindex"
                identity={false}
            />
            <div class="text-center kk-cascade [--kk-cascade-step:20ms]">
                <TerminalCommandHeader command="cat missing.txt" class="mx-auto mb-8 w-fit animate-fade-up" />
                <div class="mb-4 animate-fade-up font-mono text-6xl font-bold text-emerald-800 dark:text-emerald-400">
                    404
                </div>
                <h1 class="mb-4 animate-fade-up text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                    Page Not Found
                </h1>
                <p class="mb-8 animate-fade-up font-mono text-sm text-stone-600 dark:text-stone-400">
                    The page you requested could not be found.
                </p>
                <nav
                    aria-label="Recovery"
                    class="mb-8 flex animate-fade-up flex-wrap items-center justify-center gap-x-5 gap-y-2"
                >
                    <Anchor href="/llms.txt" variant="subtle" rel="external" class="underline">
                        llms.txt
                    </Anchor>
                    <Anchor href="/developers" variant="subtle" class="underline">
                        developers
                    </Anchor>
                    <Anchor href="/sitemap-index.xml" variant="subtle" rel="external" class="underline">
                        sitemap
                    </Anchor>
                    <Anchor href="/logs" variant="subtle" class="underline">
                        logs
                    </Anchor>
                </nav>
                <p class="animate-fade-up font-mono text-xs text-stone-600 dark:text-stone-300">
                    ERR_FILE_NOT_FOUND · {location.pathname}
                </p>
                <p class="mt-2 animate-fade-up font-mono text-xs text-stone-600 dark:text-stone-300">
                    Spotted a bad link?{" "}
                    <Anchor href="/contact" variant="prose">
                        Tell me via contact
                    </Anchor>
                    .
                </p>
                <div class="mt-8 animate-fade-up">
                    <a
                        href="/"
                        class="-mx-2 inline-flex items-center gap-2 px-2 py-3 font-mono text-sm text-stone-600 transition-colors hover:text-emerald-800 dark:text-stone-300 dark:hover:text-emerald-400"
                    >
                        <ChevronRight class="size-4 rotate-180" />
                        Return to home
                    </a>
                </div>
            </div>
        </main>
    )
}
