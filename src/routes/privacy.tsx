import { PrivacyCollection } from "@features/privacy/collection"
import { PrivacyFooter } from "@features/privacy/footer"
import { PrivacyLocalStorage } from "@features/privacy/local-storage"
import { PrivacyQuestions } from "@features/privacy/questions"
import { DocumentPage } from "@pattern/document-page"
import { PageHeader, PageHeaderTitle } from "@pattern/page-header"
import { Seo } from "@pattern/seo"
import { TerminalCommandHeader } from "@pattern/terminal-command-header"

export default function PrivacyRoute() {
    return (
        <DocumentPage>
            <PageHeader class="animate-rise">
                <TerminalCommandHeader command="cat privacy.txt" class="mb-4" />
                <PageHeaderTitle>Privacy</PageHeaderTitle>
            </PageHeader>
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
