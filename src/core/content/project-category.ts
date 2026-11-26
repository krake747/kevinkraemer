export const PROJECT_CATEGORIES = ["site", "tool", "service"] as const

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number]
