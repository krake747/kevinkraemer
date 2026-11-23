function createUtcDateFormatter(month: "long" | "short"): (date: string | Date) => string {
    const format = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month,
        day: "numeric",
        timeZone: "UTC",
    })
    return (date) => format.format(new Date(date))
}

const formatLong = createUtcDateFormatter("long")
const formatShort = createUtcDateFormatter("short")

export function formatDateLong(date: string | Date): string {
    return formatLong(date)
}

export function formatDateShort(date: string | Date): string {
    return formatShort(date)
}
