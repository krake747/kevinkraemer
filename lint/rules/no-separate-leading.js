import { defineRule } from "vite-plus/lint/plugins"

import { isUnderSrc, templateText } from "./shared.js"

function base(token) {
    const parts = token.split(":")
    return parts[parts.length - 1] ?? token
}

function isLeading(token) {
    return base(token).startsWith("leading-")
}

function isTextSize(token) {
    return /^text-(xs|sm|base|lg|xl|\d+xl)$/.test(base(token))
}

function tokensOf(value) {
    return value.split(/\s+/).filter((token) => token.length > 0)
}

function withoutLeading(value) {
    return tokensOf(value)
        .filter((token) => !isLeading(token))
        .join(" ")
}

export const noSeparateLeading = defineRule({
    meta: {
        type: "suggestion",
        docs: {
            description: "Keep leading with its text size instead of a separate leading utility",
        },
        fixable: "code",
        messages: {
            separateLeading: "Separate leading-* utility; keep leading with its text size instead.",
        },
    },
    create(context) {
        if (!isUnderSrc(context.filename)) {
            return {}
        }
        function check(node, value) {
            const tokens = tokensOf(value)
            if (!tokens.some(isLeading)) {
                return
            }
            if (!tokens.some(isTextSize)) {
                context.report({ node, messageId: "separateLeading" })
                return
            }
            const fixed = withoutLeading(value)
            const raw = context.sourceCode.getText(node)
            const quote = raw[0] ?? '"'
            context.report({
                node,
                messageId: "separateLeading",
                fix(fixer) {
                    return fixer.replaceText(node, `${quote}${fixed}${quote}`)
                },
            })
        }
        return {
            Literal(node) {
                if (typeof node.value !== "string") {
                    return
                }
                check(node, node.value)
            },
            TemplateLiteral(node) {
                const text = templateText(node)
                if (node.expressions.length > 0) {
                    if (tokensOf(text).some(isLeading)) {
                        context.report({ node, messageId: "separateLeading" })
                    }
                    return
                }
                check(node, text)
            },
        }
    },
})
