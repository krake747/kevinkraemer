import { ContactGuide } from "@features/contact/guide"
import { ContactLayout } from "@features/contact/layout"
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
                <ContactGuide />
            </ContactLayout>
        </ProseShell>
    )
}
