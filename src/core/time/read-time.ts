export function getWordCount(body?: string): number {
    if (!body) {
        return 0
    }
    const trimmed = body.trim()
    if (trimmed === "") {
        return 0
    }
    return trimmed.split(/\s+/).length
}

const WORD_COUNT_FORMAT = new Intl.NumberFormat("en-US")

export function formatWordCount(body?: string): string {
    return WORD_COUNT_FORMAT.format(getWordCount(body))
}

export function getReadTime(body?: string): string {
    const words = getWordCount(body)
    const minutes = Math.ceil(words / 200)
    return `${minutes} min read`
}
