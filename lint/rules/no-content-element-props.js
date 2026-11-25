import { defineRule } from "vite-plus/lint/plugins"

import { isUiOrPatternTsx } from "./shared.js"

function propName(key) {
    if (key === undefined || key === null) {
        return null
    }
    if (key.type === "Identifier") {
        return key.name
    }
    if (key.type === "Literal" && typeof key.value === "string") {
        return key.value
    }
    return null
}

function qualifiedName(node) {
    if (node === undefined || node === null) {
        return null
    }
    if (node.type === "Identifier") {
        return node.name
    }
    if (node.type === "TSQualifiedName") {
        const left = qualifiedName(node.left)
        const right = node.right.type === "Identifier" ? node.right.name : null
        if (left !== null && right !== null) {
            return `${left}.${right}`
        }
    }
    return null
}

function isJsxElementType(node, source) {
    if (node === undefined || node === null) {
        return false
    }
    if (node.type === "TSParenthesizedType") {
        return isJsxElementType(node.typeAnnotation, source)
    }
    if (node.type !== "TSTypeReference") {
        return false
    }
    const name = qualifiedName(node.typeName)
    if (name === "JSX.Element") {
        return true
    }
    return source.getText(node).replace(/\s+/g, "") === "JSX.Element"
}

function isNoneKeyword(node) {
    return node.type === "TSUndefinedKeyword" || node.type === "TSNullKeyword" || node.type === "TSVoidKeyword"
}

function isNullLiteral(node) {
    if (node.type !== "TSLiteralType") {
        return false
    }
    return node.literal.type === "Literal" && node.literal.value === null
}

function isNoneText(node, source) {
    const text = source.getText(node).replace(/\s+/g, "")
    return text === "undefined" || text === "null" || text === "void"
}

function isNoneType(node, source) {
    if (node === undefined || node === null) {
        return false
    }
    if (node.type === "TSParenthesizedType") {
        return isNoneType(node.typeAnnotation, source)
    }
    if (isNoneKeyword(node)) {
        return true
    }
    if (isNullLiteral(node)) {
        return true
    }
    return isNoneText(node, source)
}

function isElementLike(node, source) {
    if (node === undefined || node === null) {
        return false
    }
    if (node.type === "TSParenthesizedType") {
        return isElementLike(node.typeAnnotation, source)
    }
    if (isJsxElementType(node, source)) {
        return true
    }
    if (node.type === "TSUnionType") {
        return hasElementMember(node, source)
    }
    return false
}

function hasElementMember(node, source) {
    let found = false
    for (const member of node.types) {
        if (isJsxElementType(member, source)) {
            found = true
        } else if (!isNoneType(member, source)) {
            return false
        }
    }
    return found
}

function returnHoldsElement(node, source) {
    if (node === undefined || node === null) {
        return false
    }
    if (node.type === "TSTypeAnnotation") {
        return returnHoldsElement(node.typeAnnotation, source)
    }
    if (node.type === "TSParenthesizedType") {
        return returnHoldsElement(node.typeAnnotation, source)
    }
    if (node.type === "TSUnionType") {
        return node.types.some((member) => returnHoldsElement(member, source))
    }
    if (isJsxElementType(node, source)) {
        return true
    }
    return source.getText(node).includes("JSX.Element")
}

function isFunctionReturningElement(node, source) {
    if (node === undefined || node === null) {
        return false
    }
    if (node.type === "TSTypeAnnotation") {
        return isFunctionReturningElement(node.typeAnnotation, source)
    }
    if (node.type === "TSParenthesizedType") {
        return isFunctionReturningElement(node.typeAnnotation, source)
    }
    if (node.type === "TSUnionType") {
        return node.types.some((member) => isFunctionReturningElement(member, source))
    }
    if (node.type === "TSFunctionType") {
        return returnHoldsElement(node.returnType, source)
    }
    return false
}

function refName(node) {
    if (node.type !== "TSTypeReference") {
        return null
    }
    return qualifiedName(node.typeName)
}

function shortName(name) {
    if (name === null) {
        return null
    }
    const index = name.lastIndexOf(".")
    return index === -1 ? name : name.slice(index + 1)
}

function parentPropsMembers(node, aliases, seen) {
    const params = node.typeArguments?.params ?? node.typeParameters?.params ?? []
    return params.flatMap((param) => resolveMembers(param, aliases, seen))
}

function aliasMembers(name, aliases, seen) {
    if (seen.has(name)) {
        return []
    }
    const target = aliases.get(name)
    if (target === undefined) {
        return []
    }
    seen.add(name)
    return resolveMembers(target, aliases, seen)
}

function resolveReference(node, aliases, seen) {
    const name = shortName(refName(node))
    if (name === null) {
        return []
    }
    if (name === "ParentProps") {
        return parentPropsMembers(node, aliases, seen)
    }
    return aliasMembers(name, aliases, seen)
}

function resolveMembers(node, aliases, seen) {
    if (node === undefined || node === null) {
        return []
    }
    if (node.type === "TSTypeAnnotation") {
        return resolveMembers(node.typeAnnotation, aliases, seen)
    }
    if (node.type === "TSParenthesizedType") {
        return resolveMembers(node.typeAnnotation, aliases, seen)
    }
    if (node.type === "TSTypeLiteral") {
        return node.members
    }
    if (node.type === "TSIntersectionType") {
        return node.types.flatMap((part) => resolveMembers(part, aliases, seen))
    }
    if (node.type === "TSTypeReference") {
        return resolveReference(node, aliases, seen)
    }
    return []
}

function reportOnce(context, member, reported, messageId, name) {
    if (reported.has(member)) {
        return
    }
    reported.add(member)
    if (name === undefined) {
        context.report({ node: member, messageId })
    } else {
        context.report({ node: member, messageId, data: { name } })
    }
}

function checkRenderProp(context, member, reported) {
    if (member.type === "TSMethodSignature") {
        return
    }
    if (isFunctionReturningElement(member.typeAnnotation, context.sourceCode)) {
        return
    }
    const annotation = member.typeAnnotation?.typeAnnotation
    if (isElementLike(annotation, context.sourceCode)) {
        reportOnce(context, member, reported, "noElementProp", "render")
    }
}

function checkElementProp(context, member, reported, name) {
    const annotation = member.typeAnnotation?.typeAnnotation
    if (isElementLike(annotation, context.sourceCode)) {
        reportOnce(context, member, reported, "noElementProp", name)
    }
}

function checkMember(context, member, reported) {
    if (member.computed === true) {
        return
    }
    const name = propName(member.key)
    if (name === null || name === "children") {
        return
    }
    if (name === "as") {
        reportOnce(context, member, reported, "noAsProp", undefined)
        return
    }
    if (name === "render") {
        checkRenderProp(context, member, reported)
        return
    }
    checkElementProp(context, member, reported, name)
}

function componentProps(fn) {
    const [props] = fn.params
    if (props === undefined || props.type !== "Identifier" || props.typeAnnotation === undefined) {
        return null
    }
    return props.typeAnnotation
}

function checkTarget(context, fn, aliases, reported) {
    const annotation = componentProps(fn)
    if (annotation === null) {
        return
    }
    for (const member of resolveMembers(annotation, aliases, new Set())) {
        if (member.type === "TSPropertySignature" || member.type === "TSMethodSignature") {
            checkMember(context, member, reported)
        }
    }
}

function isComponentFunction(init) {
    return init?.type === "ArrowFunctionExpression" || init?.type === "FunctionExpression"
}

function checkDeclaratorTarget(context, declarator, aliases, reported) {
    if (declarator.id.type !== "Identifier") {
        return
    }
    const init = declarator.init
    if (!isComponentFunction(init)) {
        return
    }
    checkTarget(context, init, aliases, reported)
}

function checkVariableDeclaration(context, declaration, aliases, reported) {
    for (const declarator of declaration.declarations) {
        checkDeclaratorTarget(context, declarator, aliases, reported)
    }
}

function checkExportedDeclaration(context, node, aliases, reported) {
    const declaration = node.declaration
    if (declaration?.type === "FunctionDeclaration") {
        checkTarget(context, declaration, aliases, reported)
    }
    if (declaration?.type === "VariableDeclaration") {
        checkVariableDeclaration(context, declaration, aliases, reported)
    }
}

function handleProgramExit(context, pending, aliases, reported) {
    for (const node of pending) {
        checkExportedDeclaration(context, node, aliases, reported)
    }
}

export const noContentElementProps = defineRule({
    meta: {
        type: "problem",
        docs: {
            description: "Props carry data, not content; pass content as children of a part",
        },
        messages: {
            noAsProp: "Drop the `as` prop and favour `render` instead.",
            noElementProp: "Pass {{name}} as children of a part, not as a JSX.Element prop.",
        },
    },
    create(context) {
        if (!isUiOrPatternTsx(context.filename)) {
            return {}
        }
        const aliases = new Map()
        const pending = []
        const reported = new Set()
        return {
            TSTypeAliasDeclaration(node) {
                aliases.set(node.id.name, node.typeAnnotation)
            },
            TSInterfaceDeclaration(node) {
                aliases.set(node.id.name, { type: "TSTypeLiteral", members: node.body.body })
            },
            ExportNamedDeclaration(node) {
                pending.push(node)
            },
            "Program:exit"() {
                handleProgramExit(context, pending, aliases, reported)
            },
        }
    },
})
