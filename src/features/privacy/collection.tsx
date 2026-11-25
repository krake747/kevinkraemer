import { DocumentSection, DocumentSectionBody } from "@pattern/document-section"

export function PrivacyCollection() {
    return (
        <DocumentSection id="privacy-collection-heading" title="what is collected">
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
