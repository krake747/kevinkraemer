import { DocumentSection, DocumentSectionBody, SectionHeading } from "@pattern/section"
export function PrivacyCollection() {
    return (
        <DocumentSection aria-labelledby="privacy-collection-heading">
            <SectionHeading id="privacy-collection-heading">what is collected</SectionHeading>
            <DocumentSectionBody>
                <p>
                    Nothing by the site itself. There are no analytics scripts, no tracking pixels, no advertising, no
                    cookies, and no account system. Fonts are self-hosted, so your browser talks only to this domain
                    while you read.
                </p>
                <p>
                    The site is hosted on Netlify. Like any web host, it processes standard request logs (IP address,
                    requested URL, timestamp, user agent) to serve pages and protect against abuse. These logs are under
                    Netlify's control and are not used by this site for profiling or marketing.
                </p>
            </DocumentSectionBody>
        </DocumentSection>
    )
}
