import { defineRule } from "vite-plus/lint/plugins"

function pointsAtStyles(specifier) {
    if (specifier === "@styles" || specifier.startsWith("@styles/")) {
        return true
    }
    if (specifier.includes("src/styles")) {
        return true
    }
    if (specifier.startsWith("./") || specifier.startsWith("../")) {
        return specifier.split("/").includes("styles")
    }
    return false
}

export const noStylesImport = defineRule({
    meta: {
        type: "problem",
        docs: {
            description: "Styles live in the Tailwind theme, not a src/styles folder",
        },
        messages: {
            stylesImport: "Do not import from {{specifier}}; there is no src/styles folder.",
            stylesFile: "Files under src/styles/ are not allowed; there is no src/styles folder.",
        },
    },
    create(context) {
        if (context.filename.includes("src/styles/")) {
            return {
                Program(program) {
                    context.report({ node: program, messageId: "stylesFile" })
                },
            }
        }
        function check(node) {
            const specifier = node.source?.value
            if (typeof specifier !== "string" || !pointsAtStyles(specifier)) {
                return
            }
            context.report({ node, messageId: "stylesImport", data: { specifier } })
        }
        return {
            ImportDeclaration: check,
            ExportAllDeclaration: check,
            ExportNamedDeclaration(node) {
                if (node.source !== null) {
                    check(node)
                }
            },
        }
    },
})
