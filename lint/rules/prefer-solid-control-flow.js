import { defineRule } from "vite-plus/lint/plugins"

import { isUnderSrc } from "./shared.js"

function isSrcTsx(filename) {
    return typeof filename === "string" && filename.endsWith(".tsx") && isUnderSrc(filename)
}

function isJsx(node) {
    return node !== undefined && node !== null && (node.type === "JSXElement" || node.type === "JSXFragment")
}

function isJsxParent(node) {
    return node !== undefined && node !== null && (node.type === "JSXElement" || node.type === "JSXFragment")
}

function isJsxChildContainer(node) {
    return node !== undefined && node !== null && node.type === "JSXExpressionContainer" && isJsxParent(node.parent)
}

function isJsxChildConditional(node) {
    let current = node.parent
    while (current !== undefined && current !== null) {
        if (isJsxChildContainer(current)) {
            return true
        }
        if (current.type === "ArrowFunctionExpression") {
            return isJsxChildContainer(current.parent)
        }
        if (current.type !== "ReturnStatement" && current.type !== "BlockStatement") {
            return false
        }
        current = current.parent
    }
    return false
}

function checkConditional(context, node) {
    if (!isJsxChildConditional(node)) {
        return
    }
    const consequentIsJsx = isJsx(node.consequent)
    const alternateIsJsx = isJsx(node.alternate)
    if (!consequentIsJsx && !alternateIsJsx) {
        return
    }
    if (consequentIsJsx && alternateIsJsx) {
        context.report({ node, messageId: "preferSwitch" })
    } else {
        context.report({ node, messageId: "preferShow" })
    }
}

function checkLogical(context, node) {
    if (node.operator !== "&&") {
        return
    }
    if (!isJsx(node.left) && !isJsx(node.right)) {
        return
    }
    if (!isJsxChildConditional(node)) {
        return
    }
    context.report({ node, messageId: "preferShow" })
}

export const preferSolidControlFlow = defineRule({
    meta: {
        type: "problem",
        docs: {
            description: "Favour <Show>, <Switch>/<Match>, or <For> over JSX ternaries and &&",
        },
        messages: {
            preferShow: "Favour <Show> over a JSX ternary or && with a single JSX branch.",
            preferSwitch: "Favour <Switch> and <Match> over a JSX ternary with a JSX branch on both sides.",
        },
    },
    create(context) {
        if (!isSrcTsx(context.filename)) {
            return {}
        }
        return {
            ConditionalExpression(node) {
                checkConditional(context, node)
            },
            LogicalExpression(node) {
                checkLogical(context, node)
            },
        }
    },
})
