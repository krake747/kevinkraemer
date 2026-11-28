import type { ToolAnnotations } from "@modelcontextprotocol/server"

export const mcpAskToolTitle = "Ask kevinkraemer.com"

export const mcpAskToolDescription =
    "Answer a question from the content published on kevinkraemer.com; returns the matching pages and, unless summarize is false, a written answer."

export const mcpAskToolAnnotations = {
    readOnlyHint: true,
    openWorldHint: false,
} satisfies ToolAnnotations
