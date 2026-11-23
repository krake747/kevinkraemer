export function getWordCount(body: string): number {
    const trimmed = body.trim()
    if (trimmed === "") {
        return 0
    }
    return trimmed.split(/\s+/).length
}

const WORD_COUNT_FORMAT = new Intl.NumberFormat("en-US")

const READ_WORDS_PER_MINUTE = 200

export function formatWordCount(body: string): string {
    return WORD_COUNT_FORMAT.format(getWordCount(body))
}

export function getReadTime(body: string): string {
    const words = getWordCount(body)
    const minutes = Math.ceil(words / READ_WORDS_PER_MINUTE)
    return `${minutes} min read`
}
