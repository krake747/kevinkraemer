import { ContactChannels } from "@features/contact/channels"
import { ContactGuide } from "@features/contact/guide"
import { ContactStatus } from "@features/contact/status"
import { DocumentPage } from "@pattern/document-page"
import { RegisterWithRail } from "@pattern/register"
import { Seo } from "@pattern/seo"

export default function ContactRoute() {
    return (
        <DocumentPage
            command={'echo "Get in touch"'}
            title="Contact"
            lede="Email is the fastest route. It lands directly with me, and I usually reply within a couple of business days."
        >
            <Seo
                title="Contact"
                description="Email is the fastest way to reach me. GitHub and LinkedIn work too. Based in Luxembourg, open to full-stack roles or just talking shop."
                path="/contact"
            />
            <div class="flex flex-col gap-10">
                <ContactChannels />
                <RegisterWithRail spacing="loose" rail={<ContactStatus as="aside" />}>
                    <ContactStatus as="details" />
                    <ContactGuide />
                </RegisterWithRail>
            </div>
        </DocumentPage>
    )
}
