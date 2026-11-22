import type { LogEntry } from "@core/content/model"
import { webMcpTools, type Navigate, type WebMcpTool } from "@features/webmcp/tools"

type ModelContext = {
    registerTool(tool: WebMcpTool, options?: { signal?: AbortSignal }): Promise<void> | void
}

export function registerWebMcpTools(entries: readonly LogEntry[], navigate: Navigate, signal: AbortSignal): void {
    const context = browserModelContext()
    if (context === undefined) {
        return
    }
    for (const tool of webMcpTools(entries, navigate)) {
        void Promise.resolve(context.registerTool(tool, { signal })).catch((error: unknown) => {
            console.error(`Failed to register the WebMCP tool "${tool.name}".`, error)
        })
    }
}

function browserModelContext(): ModelContext | undefined {
    return scopeModelContext(document) ?? scopeModelContext(navigator)
}

function scopeModelContext(scope: object): ModelContext | undefined {
    if (!("modelContext" in scope)) {
        return undefined
    }
    return isModelContext(scope.modelContext) ? scope.modelContext : undefined
}

function isModelContext(value: unknown): value is ModelContext {
    return (
        typeof value === "object" &&
        value !== null &&
        "registerTool" in value &&
        typeof value.registerTool === "function"
    )
}
