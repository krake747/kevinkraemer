import { useLocation } from "@solidjs/router"
import { Anchor } from "@ui/anchor"
import { ChevronRight } from "@ui/icon"

export function NotFoundDiagnostics() {
    const location = useLocation()

    return (
        <>
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
        </>
    )
}
