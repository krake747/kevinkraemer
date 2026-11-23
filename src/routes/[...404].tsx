import { NotFoundDiagnostics } from "@features/not-found/diagnostics"
import { NotFoundHero } from "@features/not-found/hero"
import { NotFoundRecovery } from "@features/not-found/recovery"
import { Seo } from "@pattern/seo"
import { httpStatus } from "@solidjs/web"

export default function NotFoundRoute() {
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
                <NotFoundHero />
                <NotFoundRecovery />
                <NotFoundDiagnostics />
            </div>
        </main>
    )
}
