import { ContactChannels } from "@features/contact/channels"
import { ContactGuide } from "@features/contact/guide"
import { ContactStatusDisclosure, ContactStatusPanel } from "@features/contact/status"
import { DocumentPage, PageHeaderTitle } from "@pattern/page"
import { RegisterWithRail, RegisterWithRailMain, RegisterWithRailRail } from "@pattern/register"
import { Seo } from "@pattern/seo"
import { TerminalCommandHeader } from "@pattern/terminal"

export default function ContactRoute() {
    return (
        <DocumentPage>
            <header class="animate-rise">
                <TerminalCommandHeader command="say hello" class="mb-4" />
                <PageHeaderTitle>Contact</PageHeaderTitle>
            </header>
            <Seo
                title="Contact"
                description="Email is the fastest way to reach me. GitHub and LinkedIn work too. Based in Luxembourg, open to full-stack roles or just talking shop."
                path="/contact"
            />
            <div class="flex flex-col gap-10">
                <ContactChannels />
                <RegisterWithRail spacing="loose">
                    <RegisterWithRailMain>
                        <ContactStatusDisclosure />
                        <ContactGuide />
                    </RegisterWithRailMain>
                    <RegisterWithRailRail labelledby="contact-status-label">
                        <ContactStatusPanel />
                    </RegisterWithRailRail>
                </RegisterWithRail>
            </div>
        </DocumentPage>
    )
}
