import { defineRule } from "vite-plus/lint/plugins"

import { isUnderSrc } from "./shared.js"

const CODE_EXTENSIONS = new Set(["cjs", "cts", "js", "jsx", "mjs", "mts", "ts", "tsx"])

function isRelative(specifier) {
    if (specifier.startsWith("./")) {
        return true
    }
    return specifier.startsWith("../")
}

function extension(specifier) {
    const clean = specifier.split("?")[0].split("#")[0]
    const base = clean.slice(clean.lastIndexOf("/") + 1)
    const dot = base.lastIndexOf(".")
    if (dot === -1) {
        return ""
    }
    return base.slice(dot + 1).toLowerCase()
}

function isCodeSpecifier(specifier) {
    const ext = extension(specifier)
    if (ext === "") {
        return true
    }
    return CODE_EXTENSIONS.has(ext)
}

function isAllowlisted(filename) {
    return filename.endsWith("src/core/site/problem.ts") || filename.endsWith("src/core/content/content-intake.ts")
}

export const aliasImports = defineRule({
    meta: {
        type: "problem",
        docs: {
            description: "Use alias imports instead of relative imports for TS/JS modules under src/",
        },
        messages: {
            relativeImport: "Use an alias import instead of relative {{specifier}}.",
        },
    },
    create(context) {
        if (!isUnderSrc(context.filename)) {
            return {}
        }
        if (isAllowlisted(context.filename)) {
            return {}
        }
        function check(node) {
            const specifier = node.source?.value
            if (typeof specifier !== "string") {
                return
            }
            if (!isRelative(specifier)) {
                return
            }
            if (!isCodeSpecifier(specifier)) {
                return
            }
            context.report({ node, messageId: "relativeImport", data: { specifier } })
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
