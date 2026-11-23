import { CONTENT_BUNDLE_VERSION } from "@core/content/content-intake"
import type { ContentBundle } from "@core/content/model"
import { content } from "@generated/content"

if (content.meta.version !== CONTENT_BUNDLE_VERSION) {
    throw new Error(`content bundle v${content.meta.version} does not match reader v${CONTENT_BUNDLE_VERSION}`)
}

export const siteContent: ContentBundle = content
