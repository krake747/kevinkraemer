import { defineRule } from "vite-plus/lint/plugins"

import { isUnderSrc, templateText } from "./shared.js"

const HEX = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})\b/
const FUNC = /(?:rgb|rgba|hsl|hsla|oklch)\s*\(/i

function hasRawColor(value) {
    return HEX.test(value) || FUNC.test(value)
}

export const noRawColor = defineRule({
    meta: {
        type: "problem",
        docs: {
            description: "Use theme tokens instead of raw CSS colors in TS/TSX strings",
        },
        messages: {
            rawColor: "Raw CSS color; use a theme token instead.",
        },
    },
    create(context) {
        if (!isUnderSrc(context.filename)) {
            return {}
        }
        if (context.filename.endsWith("src/pattern/seo.tsx")) {
            return {}
        }
        if (context.filename.endsWith(".css")) {
            return {}
        }
        return {
            Literal(node) {
                if (typeof node.value !== "string") {
                    return
                }
                if (hasRawColor(node.value)) {
                    context.report({ node, messageId: "rawColor" })
                }
            },
            TemplateLiteral(node) {
                if (hasRawColor(templateText(node))) {
                    context.report({ node, messageId: "rawColor" })
                }
            },
        }
    },
})
