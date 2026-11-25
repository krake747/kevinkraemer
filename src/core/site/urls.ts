import { site } from "@core/site/site-meta"

export const origin = site.url.replace(/\/$/, "")

export const CV_PDF_PATH = "/20260503_kevinkraemer_cv.pdf"

export const RSS_PATH = "/rss.xml"

export function canonicalFor(path: string): string {
    return `${origin}${path}`
}

export type Crumb = { name: string; url?: string }

export function sectionTrail(sectionName: string, sectionPath: string, currentName: string): Crumb[] {
    return [
        { name: "Home", url: canonicalFor("/") },
        { name: sectionName, url: canonicalFor(sectionPath) },
        { name: currentName },
    ]
}
