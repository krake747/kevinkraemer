import { defineRule } from "vite-plus/lint/plugins"

import { isUnderSrc, templateText } from "./shared.js"

function isTransitionAll(token) {
    const parts = token.split(":")
    const base = parts[parts.length - 1] ?? token
    return base === "transition-all"
}

function hasTransitionAll(value) {
    return value.split(/\s+/).some(isTransitionAll)
}

export const noTransitionAll = defineRule({
    meta: {
        type: "suggestion",
        docs: {
            description: "Avoid the transition-all utility; transition specific properties instead",
        },
        messages: {
            transitionAll: "Avoid transition-all; use a specific transition such as transition-colors.",
        },
    },
    create(context) {
        if (!isUnderSrc(context.filename)) {
            return {}
        }
        return {
            Literal(node) {
                if (typeof node.value !== "string") {
                    return
                }
                if (hasTransitionAll(node.value)) {
                    context.report({ node, messageId: "transitionAll" })
                }
            },
            TemplateLiteral(node) {
                if (hasTransitionAll(templateText(node))) {
                    context.report({ node, messageId: "transitionAll" })
                }
            },
        }
    },
})
