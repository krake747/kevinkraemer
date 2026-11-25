import { NotFoundDiagnostics } from "@features/not-found/diagnostics"
import { NotFoundHero } from "@features/not-found/hero"
import { NotFoundLayout } from "@features/not-found/layout"
import { NotFoundRecovery } from "@features/not-found/recovery"
import { Seo } from "@pattern/seo"
import { Meta } from "@solidjs/meta"
import { httpStatus } from "@solidjs/web"

export default function NotFoundRoute() {
    httpStatus(404)

    return (
        <NotFoundLayout>
            <Seo title="404 · Page Not Found" description="The page you are looking for does not exist." />
            <Meta name="robots" content="noindex, nofollow" />
            <NotFoundHero />
            <NotFoundRecovery />
            <NotFoundDiagnostics />
        </NotFoundLayout>
    )
}
