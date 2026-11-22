import { defineRule } from "vite-plus/lint/plugins"

export const strictTypes = defineRule({
    meta: {
        type: "problem",
        docs: {
            description: "Ban unchecked casts and weak Record shapes; narrow, validate, or infer instead",
        },
        messages: {
            weakRecord: "Record<string, unknown> is too weak; use the JsonLd pattern or a named shape.",
            uncheckedCast: "Unchecked `as` cast; narrow, validate, or infer instead (`as const` stays allowed).",
        },
    },
    create(context) {
        return {
            TSAsExpression(node) {
                const annotation = context.sourceCode.getText(node.typeAnnotation).replace(/\s+/g, " ").trim()
                if (annotation === "const") {
                    return
                }
                context.report({ node, messageId: "uncheckedCast" })
            },
            TSTypeReference(node) {
                if (node.typeName.type !== "Identifier" || node.typeName.name !== "Record") {
                    return
                }
                const params = node.typeArguments?.params ?? []
                if (
                    params.length === 2 &&
                    params[0].type === "TSStringKeyword" &&
                    params[1].type === "TSUnknownKeyword"
                ) {
                    context.report({ node, messageId: "weakRecord" })
                }
            },
        }
    },
})
