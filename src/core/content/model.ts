import type { FlowName } from "@core/content/graphs"
import type { ProjectCategory } from "@core/content/project-category"
import { compareDatesDesc } from "@core/time/date"

export type GraphFlowSpec =
    | { kind: "single"; title: string; flow: FlowName }
    | { kind: "compare"; title: string; flow: FlowName; compare: FlowName; third?: FlowName }

export type LogTocEntry = {
    id: string
    text: string
}

export type LogEntry = {
    id: string
    title: string
    description: string
    date: string
    tags: string[]
    body: string
    html: string
    graphs: GraphFlowSpec[]
    toc: LogTocEntry[]
}

export type AboutEntry = {
    id: string
    title: string
    order: number
    html: string
    graphs: GraphFlowSpec[]
}

export type EmploymentPeriod = { kind: "current"; start: string } | { kind: "past"; start: string; end: string }

export type ExperienceEntry = {
    id: string
    company: string
    role: string
    location: string
    startDate: string
    endDate: string | null
    order: number
    responsibilities: string[]
}

type UsesItemBase = {
    name: string
    note: string
}

export type UsesItem =
    | (UsesItemBase & { kind: "link"; href: string; ariaLabel?: string })
    | (UsesItemBase & { kind: "text" })

export type UsesGroupLayout = "rows" | "daily" | "hardware" | "plain"

export type UsesGroup = {
    label: string
    note?: string
    layout: UsesGroupLayout
    items: UsesItem[]
}

export type UsesSection = {
    id: string
    label: string
    order: number
    groups: UsesGroup[]
}

export type ProjectDecision = {
    title: string
    reason: string
}

export type ProjectFigure = {
    value: string
    label: string
    source?: "prerender-routes" | "manual"
}

export type Project = {
    id: string
    name: string
    tagline: string
    category?: ProjectCategory
    featured: boolean
    status: string
    year?: number
    stack: string[]
    role: string
    liveUrl?: string
    repoUrl?: string
    figure?: ProjectFigure
    order: number
    problem: string
    decisions: ProjectDecision[]
    implementation?: string
    tradeoffs: ProjectDecision[]
    html: string
    graphs: GraphFlowSpec[]
}

export type ContentBundle = {
    meta: { cvUpdated: string; usesUpdated: string; buildDate: string; buildYear: number; version: number }
    logs: LogEntry[]
    about: AboutEntry[]
    experience: ExperienceEntry[]
    uses: UsesSection[]
    projects: Project[]
}

export function findById<T extends { id: string }>(items: readonly T[], id: string | undefined): T | undefined {
    return id === undefined ? undefined : items.find((item) => item.id === id)
}

function compareByDateDesc(a: { date: string }, b: { date: string }): number {
    return compareDatesDesc(a.date, b.date)
}

export function sortByDateDesc<T extends { date: string }>(items: readonly T[]): T[] {
    return items.toSorted(compareByDateDesc)
}

export function getRecentLogEntries(entries: readonly LogEntry[], limit: number): LogEntry[] {
    return sortByDateDesc(entries).slice(0, limit)
}

export function getAllTags(entries: readonly LogEntry[]): string[] {
    return [...new Set(entries.flatMap((entry) => entry.tags))].toSorted()
}

export function getRelatedLogEntries(
    entries: readonly LogEntry[],
    currentId: string,
    tags: string[],
    limit: number,
): LogEntry[] {
    return entries
        .filter((entry) => entry.id !== currentId && entry.tags.some((tag) => tags.includes(tag)))
        .toSorted(compareByDateDesc)
        .slice(0, limit)
}

type FilterableLogEntry = Pick<LogEntry, "tags" | "title" | "description">

function matchesTags(entry: FilterableLogEntry, selectedTags: string[]): boolean {
    return selectedTags.length === 0 || selectedTags.some((tag) => entry.tags.includes(tag))
}

function matchesQuery(entry: FilterableLogEntry, normalizedQuery: string): boolean {
    return (
        normalizedQuery.length === 0 ||
        entry.title.toLowerCase().includes(normalizedQuery) ||
        entry.description.toLowerCase().includes(normalizedQuery)
    )
}

export function filterLogEntries<T extends FilterableLogEntry>(
    entries: readonly T[],
    selectedTags: string[],
    query: string,
): T[] {
    const normalizedQuery = query.trim().toLowerCase()
    return entries.filter((entry) => matchesTags(entry, selectedTags) && matchesQuery(entry, normalizedQuery))
}

export function sortByOrder<T extends { order: number }>(entries: readonly T[]): T[] {
    return entries.toSorted((a, b) => a.order - b.order)
}

export function projectStatusLine(project: Pick<Project, "category" | "status" | "year">): string {
    const parts = [project.category, project.status, project.year].filter(
        (part): part is string | number => part !== undefined,
    )
    return parts.join(" · ")
}
