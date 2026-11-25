import { defineRule } from "vite-plus/lint/plugins"

import { isUiOrPatternTsx } from "./shared.js"

function walkAST(node, onNode, seen) {
    if (node === null || typeof node !== "object" || seen.has(node)) {
        return
    }
    seen.add(node)
    onNode(node)
    for (const [key, value] of Object.entries(node)) {
        if (key === "parent") {
            continue
        }
        if (Array.isArray(value)) {
            for (const item of value) {
                walkAST(item, onNode, seen)
            }
        } else {
            walkAST(value, onNode, seen)
        }
    }
}

function isHostPropsReference(node) {
    if (node.type !== "TSTypeReference" || node.typeName.type !== "Identifier") {
        return false
    }
    if (node.typeName.name !== "ComponentProps") {
        return false
    }
    const params = node.typeArguments?.params ?? []
    return (
        params.length === 1 &&
        params[0].type === "TSLiteralType" &&
        params[0].literal.type === "Literal" &&
        typeof params[0].literal.value === "string"
    )
}

function marksPolymorphic(node) {
    return node.type === "TSUnionType"
}

function isClassOmitCall(node, names) {
    if (node.type !== "CallExpression" || node.callee.type !== "Identifier" || node.callee.name !== "omit") {
        return false
    }
    if (node.arguments.length < 2 || node.arguments[0].type !== "Identifier" || !names.has(node.arguments[0].name)) {
        return false
    }
    return node.arguments.some((arg) => arg.type === "Literal" && arg.value === "class")
}

function scanAnnotation(annotation) {
    const found = { host: false, polymorphic: false }
    walkAST(
        annotation,
        (node) => {
            if (isHostPropsReference(node)) {
                found.host = true
            }
            if (marksPolymorphic(node)) {
                found.polymorphic = true
            }
        },
        new Set(),
    )
    return found
}

function collectOmittableNames(body, propsName) {
    const names = new Set([propsName])
    walkAST(
        body,
        (node) => {
            if (node.type !== "VariableDeclarator" || node.id.type !== "Identifier") {
                return
            }
            const init = node.init
            if (init?.type !== "CallExpression" || init.callee.type !== "Identifier" || init.callee.name !== "merge") {
                return
            }
            const mergesProps = init.arguments.some((arg) => arg.type === "Identifier" && arg.name === propsName)
            if (mergesProps) {
                names.add(node.id.name)
            }
        },
        new Set(),
    )
    return names
}

function usesOmitSpread(body, propsName) {
    const names = collectOmittableNames(body, propsName)
    const used = { omit: false, spread: false }
    walkAST(
        body,
        (node) => {
            if (isClassOmitCall(node, names)) {
                used.omit = true
            }
            if (node.type === "JSXSpreadAttribute") {
                used.spread = true
            }
            if (
                node.type === "CallExpression" &&
                node.callee.type === "Identifier" &&
                node.callee.name === "renderElement"
            ) {
                used.spread = true
            }
        },
        new Set(),
    )
    return used.omit && used.spread
}

function componentTarget(fn) {
    const [props] = fn.params
    if (props === undefined || props.type !== "Identifier" || props.typeAnnotation === undefined) {
        return null
    }
    return { name: props.name, annotation: props.typeAnnotation.typeAnnotation }
}

function checkTarget(context, fn, id) {
    const target = componentTarget(fn)
    if (target === null) {
        return
    }
    const scanned = scanAnnotation(target.annotation)
    if (!scanned.host || scanned.polymorphic) {
        return
    }
    if (usesOmitSpread(fn.body, target.name)) {
        return
    }
    context.report({
        node: id ?? fn,
        messageId: "missingOmit",
        data: { name: fn.id?.name ?? "component" },
    })
}

function checkDeclarator(context, declarator) {
    const init = declarator.init
    if (declarator.id.type !== "Identifier") {
        return
    }
    if (init?.type !== "ArrowFunctionExpression" && init?.type !== "FunctionExpression") {
        return
    }
    checkTarget(context, init, declarator.id)
}

export const componentPropsOmit = defineRule({
    meta: {
        type: "problem",
        docs: {
            description: "Single-host components omit owned keys and spread the rest onto the host",
        },
        messages: {
            missingOmit:
                "Single-host {{name}} must omit owned keys (class, children) and spread the rest onto the host.",
        },
    },
    create(context) {
        if (!isUiOrPatternTsx(context.filename)) {
            return {}
        }
        return {
            ExportNamedDeclaration(node) {
                const declaration = node.declaration
                if (declaration?.type === "FunctionDeclaration") {
                    checkTarget(context, declaration, declaration.id)
                }
                if (declaration?.type === "VariableDeclaration") {
                    for (const declarator of declaration.declarations) {
                        checkDeclarator(context, declarator)
                    }
                }
            },
        }
    },
})
