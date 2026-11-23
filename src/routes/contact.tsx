import { ContactChannels } from "@features/contact/channels"
import { ContactGuide } from "@features/contact/guide"
import { ContactLayout } from "@features/contact/layout"
import { ContactStatus } from "@features/contact/status"
import { ProseShell } from "@pattern/prose-shell"
import { Seo } from "@pattern/seo"

export default function ContactRoute() {
    return (
        <ProseShell
            command={'echo "Get in touch"'}
            title="Contact"
            lede="Email is the fastest route. It lands directly with me, and I usually reply within a couple of business days."
        >
            <Seo
                title="Contact"
                description="Email is the fastest way to reach me. GitHub and LinkedIn work too. Based in Luxembourg, open to full-stack roles or just talking shop."
                path="/contact"
            />
            <ContactLayout>
                <ContactChannels />
                <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_15rem]">
                    <div class="flex min-w-0 flex-col gap-10">
                        <ContactStatus as="details" />
                        <ContactGuide />
                    </div>
                    <aside class="hidden lg:block">
                        <ContactStatus as="aside" />
                    </aside>
                </div>
            </ContactLayout>
        </ProseShell>
    )
}
