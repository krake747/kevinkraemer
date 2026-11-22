import { ResourceNotFound } from "@pattern/resource-not-found"
import { httpStatus } from "@solidjs/web"

export function LogNotFound() {
    httpStatus(404)
    return <ResourceNotFound title="Log not found" backHref="/logs" backLabel="Back to all logs" />
}
