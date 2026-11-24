import { ReturnToRegister } from "@pattern/register"
import { useLocation } from "@solidjs/router"
import { Anchor } from "@ui/anchor"

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
            <ReturnToRegister href="/" label="Return to home" class="mt-8 animate-fade-up" />
        </>
    )
}
