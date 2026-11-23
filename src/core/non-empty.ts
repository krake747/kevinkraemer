export type NonEmpty<T> = [T, ...T[]]

export function isNonEmpty<T>(items: readonly T[]): items is NonEmpty<T> {
    return items.length > 0
}
