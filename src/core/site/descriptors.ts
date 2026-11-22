import { apiVersion } from "@core/site/api-version"

export type PageDescriptor = {
    url: string
    title: string
    description: string
    representations: string[]
    apiVersion: typeof apiVersion
}

export type FileDescriptor = {
    url: string
    contentType: string
    content: string
    apiVersion: typeof apiVersion
}

export type AgentViewEndpoint = {
    path: string
    url: string
    operationId: string
    summary: string
    description: string
}

export type AgentView = {
    site: string
    title: string
    description: string
    apiVersion: typeof apiVersion
    authentication: {
        required: boolean
        type: "none"
        details: string
    }
    rateLimits: {
        requestsPerMinute: number
        scope: string
        headers: string[]
        onExceeded: string
    }
    capabilities: {
        name: string
        description: string
    }[]
    endpoints: AgentViewEndpoint[]
    specification: string
    documentation: string
}
