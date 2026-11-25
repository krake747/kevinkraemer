import { PrivacyCollection } from "@features/privacy/collection"
import { PrivacyFooter } from "@features/privacy/footer"
import { PrivacyLocalStorage } from "@features/privacy/local-storage"
import { PrivacyQuestions } from "@features/privacy/questions"
import { DocumentPage } from "@pattern/document-page"
import { Seo } from "@pattern/seo"

export default function PrivacyRoute() {
    return (
        <DocumentPage command="cat privacy.txt" title="Privacy">
            <Seo
                title="Privacy"
                description="How kevinkraemer.com handles data: a static site with no analytics, no tracking, and no cookies; the only stored state is your theme preference in browser localStorage."
                path="/privacy"
            />
            <PrivacyCollection />
            <PrivacyLocalStorage />
            <PrivacyQuestions />
            <PrivacyFooter />
        </DocumentPage>
    )
}
