import { ResourceNotFound } from "@pattern/resource-not-found"
import { httpStatus } from "@solidjs/web"

export function ProjectNotFound() {
    httpStatus(404)
    return <ResourceNotFound title="Case file not found" backHref="/projects" backLabel="Back to all case files" />
}
