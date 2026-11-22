import { makePersonSchema } from "@core/site/jsonld"
import { canonicalFor } from "@core/site/urls"
import { CvPage } from "@features/cv/page"
import { Seo } from "@pattern/seo"

export default function CvRoute() {
    const canonical = canonicalFor("/cv")

    return (
        <>
            <Seo
                title="CV"
                description="Full-stack developer. Former financial risk analyst building modern web applications with React, TypeScript, Go, and cloud-native technologies."
                path="/cv"
                extraSchemas={[makePersonSchema(canonical)]}
            />
            <CvPage />
        </>
    )
}
