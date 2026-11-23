import { readdirSync } from "node:fs"
import { join } from "node:path"

export function prerenderedRoutes(directory = "dist/client", prefix = ""): string[] {
    const routes: string[] = []
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
        if (entry.isDirectory()) {
            routes.push(...prerenderedRoutes(join(directory, entry.name), `${prefix}/${entry.name}`))
        } else if (entry.name.endsWith(".html")) {
            const name = entry.name.slice(0, -".html".length)
            routes.push(name === "index" ? prefix || "/" : `${prefix}/${name}`)
        }
    }
    return routes.toSorted()
}
