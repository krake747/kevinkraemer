import { defineRule } from "vite-plus/lint/plugins"

const ALLOW_TOKENS = [
    "oxlint-disable",
    "eslint-disable",
    "fallow-ignore",
    "@ts-",
    "@vite-ignore",
    "@param",
    "@returns",
    "reference",
    "See ADR-",
]

function allowed(value) {
    return ALLOW_TOKENS.some((token) => value.includes(token))
}

export const noProseComments = defineRule({
    meta: {
        type: "suggestion",
        docs: {
            description: "Keep prose out of TS/TSX comments; move decisions to ADRs and delete the rest",
        },
        messages: {
            prose: "Prose comment: move decisions to docs/adr, file issues for excuses, delete the rest.",
        },
    },
    create(context) {
        if (!/\.[cm]?tsx?$/.test(context.filename)) {
            return {}
        }
        return {
            Program() {
                for (const comment of context.sourceCode.getAllComments()) {
                    const line = comment.loc.start.line
                    const before = context.sourceCode.lines[line - 1].slice(0, comment.loc.start.column)
                    if (before.trim() !== "") {
                        continue
                    }
                    if (allowed(comment.value)) {
                        continue
                    }
                    context.report({ node: comment, messageId: "prose" })
                }
            },
        }
    },
})
