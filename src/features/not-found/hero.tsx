import { TerminalCommandHeader } from "@pattern/terminal-command-header"

export function NotFoundHero() {
    return (
        <>
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
        </>
    )
}
