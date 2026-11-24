const STRIP_SELECTORS = ["head", "script", "style", "noscript", "nav", "footer", "header"]

const COLLAPSE_BLANK = /\n{3,}/g

const TAG_PATTERNS = STRIP_SELECTORS.map((tag) => new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>`, "gi"))

const SPAN_PATTERNS = [
    /<!--[\s\S]*?-->/g,
    /<span[^>]*class="[^"]*lambda[^"]*"[^>]*>[\s\S]*?<\/span>/gi,
    /<span[^>]*>\s*\|\s*<\/span>/gi,
]

function stripFallbackTags(html: string): string {
    return TAG_PATTERNS.reduce((cleaned, pattern) => cleaned.replace(pattern, ""), html)
}

function stripFallbackSpans(html: string): string {
    return SPAN_PATTERNS.reduce((cleaned, pattern) => cleaned.replace(pattern, ""), html)
}

function cleanWithoutDom(html: string): string {
    return stripFallbackSpans(stripFallbackTags(html)).replace(COLLAPSE_BLANK, "\n\n")
}

function removeSelectors(doc: Document): void {
    for (const selector of STRIP_SELECTORS) {
        doc.querySelectorAll(selector).forEach((element) => element.remove())
    }
}

function removeLambdaSpans(doc: Document): void {
    doc.querySelectorAll('span[class*="lambda"]').forEach((element) => element.remove())
}

function removePipeSpans(doc: Document): void {
    doc.querySelectorAll("span").forEach((element) => {
        if (element.textContent?.trim() === "|") {
            element.remove()
        }
    })
}

function removeComments(doc: Document): void {
    const walker = doc.createTreeWalker(doc, NodeFilter.SHOW_COMMENT)
    const comments: Comment[] = []
    let current: Node | null = walker.nextNode()
    while (current !== null) {
        if (current instanceof Comment) {
            comments.push(current)
        }
        current = walker.nextNode()
    }
    comments.forEach((comment) => comment.remove())
}

const cleaners: ((doc: Document) => void)[] = [removeSelectors, removeLambdaSpans, removePipeSpans, removeComments]

function cleanWithDom(html: string): string {
    const doc = new DOMParser().parseFromString(html, "text/html")
    cleaners.forEach((clean) => clean(doc))
    return (doc.body?.innerHTML ?? "").replace(COLLAPSE_BLANK, "\n\n")
}

export function cleanHtml(html: string): string {
    return typeof globalThis.DOMParser === "undefined" ? cleanWithoutDom(html) : cleanWithDom(html)
}
