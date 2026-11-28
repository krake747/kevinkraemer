import { PageHeaderTitle } from "@pattern/page"
import { TerminalCommandHeader } from "@pattern/terminal"

export function NotFoundHero() {
    return (
        <>
            <TerminalCommandHeader command="cat missing.txt" class="mx-auto mb-8 w-fit animate-fade-up" />
            <div class="mb-4 animate-fade-up font-mono text-6xl text-emerald-800 dark:text-emerald-400">404</div>
            <PageHeaderTitle class="mb-4 animate-fade-up">Page Not Found</PageHeaderTitle>
            <p class="mb-8 animate-fade-up font-mono text-sm text-stone-600 dark:text-stone-400">
                The page you requested could not be found.
            </p>
        </>
    )
}
