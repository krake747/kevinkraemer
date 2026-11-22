import type { ToolAnnotations } from "@modelcontextprotocol/server"

export const askToolTitle = "Ask kevinkraemer.com"

export const askToolDescription =
    "Answer a question from the content published on kevinkraemer.com; returns the matching pages and, unless summarize is false, a written answer."

export const askToolAnnotations = {
    readOnlyHint: true,
    openWorldHint: false,
} satisfies ToolAnnotations
