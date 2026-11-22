import { defineRule } from "vite-plus/lint/plugins"

const FUNCTION_SUBJECT = /^[a-z][a-zA-Z0-9]*[A-Z][a-zA-Z0-9]*$/

export const noDescribeFunctionTitle = defineRule({
    meta: {
        type: "suggestion",
        docs: {
            description: "Name the behaviour in describe, never a function or component identifier",
        },
        messages: {
            functionTitle: 'describe("{{title}}") names a function; name the behaviour instead.',
        },
    },
    create(context) {
        return {
            CallExpression(node) {
                if (node.callee.type !== "Identifier" || node.callee.name !== "describe") {
                    return
                }
                const [title] = node.arguments
                if (title === undefined || title.type !== "Literal" || typeof title.value !== "string") {
                    return
                }
                if (FUNCTION_SUBJECT.test(title.value)) {
                    context.report({ node: title, messageId: "functionTitle", data: { title: title.value } })
                }
            },
        }
    },
})
