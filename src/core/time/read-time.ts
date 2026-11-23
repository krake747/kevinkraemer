export function getWordCount(body: string): number {
    const trimmed = body.trim()
    if (trimmed === "") {
        return 0
    }
    return trimmed.split(/\s+/).length
}

function createWordCountFormatter(locale: string): (count: number) => string {
    const format = new Intl.NumberFormat(locale)
    return (count) => format.format(count)
}

const formatCount = createWordCountFormatter("en-US")

const READ_WORDS_PER_MINUTE = 200

export function formatWordCount(body: string): string {
    return formatCount(getWordCount(body))
}

export function getReadTime(body: string): string {
    const words = getWordCount(body)
    const minutes = Math.ceil(words / READ_WORDS_PER_MINUTE)
    return `${minutes} min read`
}
