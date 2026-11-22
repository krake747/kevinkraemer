import { mkdir, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

const OUT = fileURLToPath(new URL("../dist/functions/", import.meta.url))

const source = `import { handleRequest } from "../server/server.js"

export default async (request) => handleRequest(request)

export const config = { path: ["/ask", "/mcp"] }
`

await mkdir(OUT, { recursive: true })
await writeFile(join(OUT, "api.mjs"), source)
console.log("function: /ask, /mcp -> dist/functions/api.mjs")
