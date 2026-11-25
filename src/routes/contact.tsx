import { ContactChannels } from "@features/contact/channels"
import { ContactGuide } from "@features/contact/guide"
import { ContactStatus } from "@features/contact/status"
import { DocumentPage } from "@pattern/document-page"
import { PageHeader, PageHeaderTitle } from "@pattern/page-header"
import { RegisterWithRail } from "@pattern/register"
import { Seo } from "@pattern/seo"
import { TerminalCommandHeader } from "@ui/terminal-command-header"

export default function ContactRoute() {
    return (
        <DocumentPage>
            <PageHeader class="animate-rise">
                <TerminalCommandHeader command={'echo "Get in touch"'} class="mb-4" />
                <PageHeaderTitle>Contact</PageHeaderTitle>
            </PageHeader>
            <Seo
                title="Contact"
                description="Email is the fastest way to reach me. GitHub and LinkedIn work too. Based in Luxembourg, open to full-stack roles or just talking shop."
                path="/contact"
            />
            <div class="flex flex-col gap-10">
                <ContactChannels />
                <RegisterWithRail spacing="loose" labelledby="contact-status-label" rail={<ContactStatus as="aside" />}>
                    <ContactStatus as="details" />
                    <ContactGuide />
                </RegisterWithRail>
            </div>
        </DocumentPage>
    )
}
