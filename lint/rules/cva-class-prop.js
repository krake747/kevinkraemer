import { defineRule } from "vite-plus/lint/plugins"

function cxCallArguments(node) {
    if (node.callee.type !== "Identifier" || node.callee.name !== "cx") {
        return null
    }
    if (node.arguments.length !== 2) {
        return null
    }
    return node.arguments
}

function isPropsClass(node) {
    return (
        node.type === "MemberExpression" &&
        node.object.type === "Identifier" &&
        node.object.name === "props" &&
        node.property.type === "Identifier" &&
        node.property.name === "class" &&
        !node.computed
    )
}

function hasClassKey(options) {
    return options.properties.some(
        (property) =>
            property.type === "Property" &&
            !property.computed &&
            property.key.type === "Identifier" &&
            property.key.name === "class",
    )
}

function foldText(source, callee, options, classArg) {
    const inner = source.getText(options).slice(1, -1)
    const content = inner.replace(/\s+$/, "")
    const gap = inner.slice(content.length)
    const head = source.getText(callee)
    const tail = source.getText(classArg)
    if (content.length === 0) {
        return `cx(${head}({class: ${tail}}))`
    }
    return `cx(${head}({${content}, class: ${tail}${gap}}))`
}

export const cvaClassProp = defineRule({
    meta: {
        type: "suggestion",
        docs: {
            description: "Fold a trailing props.class argument into the cva variant call",
        },
        fixable: "code",
        messages: {
            foldClass: "Pass class inside {{name}}({ ... }) instead of as a second cx argument.",
        },
    },
    create(context) {
        return {
            CallExpression(node) {
                const args = cxCallArguments(node)
                if (args === null) {
                    return
                }
                const [variantCall, classArg] = args
                if (!isPropsClass(classArg)) {
                    return
                }
                if (variantCall.type !== "CallExpression" || variantCall.arguments.length !== 1) {
                    return
                }
                const [options] = variantCall.arguments
                if (options.type !== "ObjectExpression" || hasClassKey(options)) {
                    return
                }
                const name = variantCall.callee.type === "Identifier" ? variantCall.callee.name : "the variant"
                context.report({
                    node,
                    messageId: "foldClass",
                    data: { name },
                    fix(fixer) {
                        return fixer.replaceText(
                            node,
                            foldText(context.sourceCode, variantCall.callee, options, classArg),
                        )
                    },
                })
            },
        }
    },
})
