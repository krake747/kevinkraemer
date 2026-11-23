import { defineRule } from "vite-plus/lint/plugins"

function inRoutes(filename) {
    return filename.includes("src/routes/")
}

function routePath(filename) {
    const relative = filename.slice(filename.lastIndexOf("src/routes/") + "src/routes/".length)
    const withoutExtension = relative.replace(/\.tsx$/, "")
    if (withoutExtension === "[...404]") {
        return null
    }
    if (withoutExtension.includes("[") || withoutExtension.includes("]")) {
        return "dynamic"
    }
    if (withoutExtension === "index") {
        return "/"
    }
    if (withoutExtension.endsWith("/index")) {
        return `/${withoutExtension.slice(0, -"/index".length)}`
    }
    return `/${withoutExtension}`
}

function isNamedAttribute(attribute, name) {
    return attribute?.type === "JSXAttribute" && attribute.name?.name === name
}

function stringValue(node) {
    if (node?.type !== "Literal" || typeof node.value !== "string") {
        return null
    }
    return node.value
}

function objectValue(attribute) {
    const expression = attribute.value?.expression
    if (expression?.type !== "ObjectExpression") {
        return undefined
    }
    return expression
}

function literalPath(attribute) {
    if (!isNamedAttribute(attribute, "path")) {
        return undefined
    }
    return stringValue(attribute.value)
}

function seoObjectPath(attribute) {
    if (!isNamedAttribute(attribute, "seo")) {
        return undefined
    }
    const path = objectValue(attribute)?.properties.find((property) => property.key?.name === "path")
    return path === undefined ? undefined : stringValue(path.value)
}

export const routeSeoPath = defineRule({
    meta: {
        type: "problem",
        docs: {
            description: "Page routes declare Seo with the file's path",
        },
        messages: {
            seoPath: "A page route must declare Seo with the file's path.",
            seoPathMismatch: 'Seo path "{{actual}}" does not match the route file "{{expected}}".',
        },
    },
    create(context) {
        if (!inRoutes(context.filename) || !context.filename.endsWith(".tsx") || context.filename.includes(".spec.")) {
            return {}
        }
        const expected = routePath(context.filename)
        if (expected === null) {
            return {}
        }
        const found = []
        return {
            JSXElement(node) {
                const name = node.openingElement.name?.name
                for (const attribute of node.openingElement.attributes) {
                    if (name === "Seo") {
                        const direct = literalPath(attribute)
                        if (direct !== undefined) {
                            found.push(direct)
                        }
                    }
                    const carried = seoObjectPath(attribute)
                    if (carried !== undefined) {
                        found.push(carried)
                    }
                }
            },
            "Program:exit"(program) {
                if (found.length === 0) {
                    context.report({ node: program, messageId: "seoPath" })
                    return
                }
                if (expected === "dynamic") {
                    return
                }
                for (const actual of found) {
                    if (actual !== expected) {
                        context.report({
                            node: program,
                            messageId: "seoPathMismatch",
                            data: { actual: actual ?? "{expression}", expected },
                        })
                        return
                    }
                }
            },
        }
    },
})
