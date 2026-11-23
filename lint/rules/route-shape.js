import { defineRule } from "vite-plus/lint/plugins"

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"]

function inRoutes(filename) {
    return filename.includes("src/routes/")
}

export const routeShape = defineRule({
    meta: {
        type: "problem",
        docs: {
            description: "Route files are pages (default *Route export) or endpoints (method handler exports)",
        },
        messages: {
            pageExport: "A page route must default-export a *Route component.",
            endpointExport: "An endpoint route must export at least one method handler.",
        },
    },
    create(context) {
        if (!inRoutes(context.filename)) {
            return {}
        }
        const page = context.filename.endsWith(".tsx")
        let hasRouteExport = false
        let hasMethodExport = false
        const noteMethod = (name) => {
            if (typeof name === "string" && METHODS.includes(name)) {
                hasMethodExport = true
            }
        }
        return {
            ExportDefaultDeclaration(node) {
                const name = node.declaration?.id?.name
                if (typeof name === "string" && name.endsWith("Route")) {
                    hasRouteExport = true
                }
            },
            ExportNamedDeclaration(node) {
                noteMethod(node.declaration?.id?.name)
                if (node.declaration?.type === "VariableDeclaration") {
                    for (const declarator of node.declaration.declarations) {
                        if (declarator.id.type === "Identifier") {
                            noteMethod(declarator.id.name)
                        }
                    }
                }
            },
            "Program:exit"(program) {
                if (page && !hasRouteExport) {
                    context.report({ node: program, messageId: "pageExport" })
                }
                if (!page && !hasMethodExport) {
                    context.report({ node: program, messageId: "endpointExport" })
                }
            },
        }
    },
})
