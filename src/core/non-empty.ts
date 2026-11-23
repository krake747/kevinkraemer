export type NonEmpty<T> = [T, ...T[]]

export function isNonEmpty<T>(items: readonly T[]): items is NonEmpty<T> {
    return items.length > 0
}

export function mapToNonEmpty<T, U>(items: readonly T[], map: (item: T) => U, what = "items"): NonEmpty<U> {
    const mapped = items.map(map)
    if (!isNonEmpty(mapped)) {
        throw new Error(`${what} is empty`)
    }
    return mapped
}
