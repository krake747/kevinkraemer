import { defineRule } from "vite-plus/lint/plugins"

const BARE_UTILITIES = new Set([
    "absolute",
    "block",
    "contents",
    "fixed",
    "flex",
    "grid",
    "hidden",
    "isolate",
    "relative",
    "static",
    "sticky",
    "truncate",
])

function isUtilityToken(token) {
    if (BARE_UTILITIES.has(token)) {
        return true
    }
    if (token.includes("//") || token.includes(".") || token.includes("_")) {
        return false
    }
    if (/^(?:[a-z][a-z0-9-]*:)+[^:]+$/.test(token)) {
        return true
    }
    if (/^-?[a-z]+(?:-[a-z0-9]+)+(?:\/[a-z0-9]+)?$/.test(token)) {
        return true
    }
    if (/^(?:[a-z][a-z0-9-]*:)*[a-z-]+-\[[^\s[\]]+\](?:\/\S+)?$/.test(token)) {
        return true
    }
    return false
}

function looksLikeTailwind(value) {
    const tokens = value.split(/\s+/).filter((token) => token.length > 0)
    return tokens.filter((token) => isUtilityToken(token)).length >= 2
}

function staticText(init) {
    if (init.type === "Literal" && typeof init.value === "string") {
        return init.value
    }
    if (init.type === "TemplateLiteral" && init.expressions.length === 0) {
        return init.quasis.map((part) => part.value.cooked ?? "").join("")
    }
    return null
}

export const noClassStringConst = defineRule({
    meta: {
        type: "suggestion",
        docs: {
            description: "Keep Tailwind class strings at the use site instead of module-level constants",
        },
        messages: {
            classConst: "Module-level class string; inline it at the use site instead of naming it.",
        },
    },
    create(context) {
        function check(declaration) {
            if (declaration.type !== "VariableDeclaration" || declaration.kind !== "const") {
                return
            }
            for (const declarator of declaration.declarations) {
                if (declarator.id.type !== "Identifier" || declarator.init === null) {
                    continue
                }
                const value = staticText(declarator.init)
                if (value !== null && looksLikeTailwind(value)) {
                    context.report({ node: declarator.init, messageId: "classConst" })
                }
            }
        }
        return {
            Program(program) {
                for (const statement of program.body) {
                    if (statement.type === "ExportNamedDeclaration" && statement.declaration !== null) {
                        check(statement.declaration)
                    } else {
                        check(statement)
                    }
                }
            },
        }
    },
})
