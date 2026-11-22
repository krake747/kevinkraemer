import { defineRule } from "vite-plus/lint/plugins"

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/

function pascal(stem) {
    return stem
        .split("-")
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join("")
}

function relativePath(filename) {
    const marker = "src/features/"
    const index = filename.lastIndexOf(marker)
    return index === -1 ? null : filename.slice(index + marker.length)
}

function functionName(declaration) {
    if (declaration?.type === "FunctionDeclaration" && declaration.id !== null) {
        return declaration.id.name
    }
    return null
}

function variableNames(declaration) {
    const names = []
    if (declaration?.type !== "VariableDeclaration") {
        return names
    }
    for (const declarator of declaration.declarations) {
        if (declarator.id.type === "Identifier") {
            names.push(declarator.id.name)
        }
    }
    return names
}

function typeName(declaration) {
    if (declaration?.type === "ClassDeclaration" && declaration.id !== null) {
        return declaration.id.name
    }
    if (declaration?.type === "TSTypeAliasDeclaration") {
        return declaration.id.name
    }
    return null
}

function declaredNames(declaration) {
    const names = variableNames(declaration)
    const single = functionName(declaration) ?? typeName(declaration)
    if (single !== null) {
        names.push(single)
    }
    return names
}

function declaredComponent(declaration) {
    if (declaration?.type === "FunctionDeclaration" && declaration.id !== null && /^[A-Z]/.test(declaration.id.name)) {
        return declaration.id
    }
    return null
}

function fileParts(context) {
    const relative = relativePath(context.filename)
    if (relative === null) {
        return null
    }
    const [folder, file] = relative.split("/")
    if (folder === undefined || file === undefined || file.includes("/")) {
        return null
    }
    if (!/\.(ts|tsx)$/.test(file)) {
        return null
    }
    return { folder, file }
}

function fileStem(file) {
    return file.replace(/\.spec\.(ts|tsx)$/, "").replace(/\.(ts|tsx)$/, "")
}

function checkKebab(context, program, stem) {
    if (!KEBAB.test(stem)) {
        context.report({ node: program, messageId: "kebab" })
    }
}

function checkFolder(context, program, folder, part, stem) {
    if (stem !== folder && (part === folder || part.startsWith(`${folder}-`))) {
        context.report({ node: program, messageId: "repeatsFolder", data: { folder } })
    }
}

function checkFactory(context, program, factory, spec, feature, part, exported) {
    const built = `create${feature}${pascal(part)}`
    const named = `create${feature}`
    const accepted = feature.endsWith(pascal(part)) ? [built, named] : [built]
    if (factory && !spec && !accepted.some((name) => exported.has(name))) {
        context.report({ node: program, messageId: "factoryExport", data: { name: built } })
    }
}

function checkComponents(context, expected, components) {
    for (const component of components) {
        if (!component.name.startsWith(expected) && !expected.startsWith(component.name)) {
            context.report({
                node: component.node,
                messageId: "componentName",
                data: { name: component.name, expected },
            })
        }
    }
}

export const featureNames = defineRule({
    meta: {
        type: "problem",
        docs: {
            description: "Feature files carry their folder stem; builders and components match Feature + part",
        },
        messages: {
            kebab: "File name is not kebab-case.",
            repeatsFolder: 'File name repeats the "{{folder}}" folder; name the part, not the feature.',
            factoryExport: "A create-* module must export {{name}}.",
            componentName: "{{name}} is not named for {{expected}}.",
        },
    },
    create(context) {
        const parts = fileParts(context)
        if (parts === null) {
            return {}
        }
        const { folder, file } = parts
        const spec = file.includes(".spec.")
        const stem = fileStem(file)
        const feature = pascal(folder)
        const factory = stem.startsWith("create-")
        const part = factory ? stem.slice("create-".length) : stem
        const expected = stem === folder ? feature : `${feature}${pascal(part)}`
        const exported = new Set()
        const components = []
        return {
            ExportNamedDeclaration(node) {
                for (const name of declaredNames(node.declaration)) {
                    exported.add(name)
                }
                const component = declaredComponent(node.declaration)
                if (component !== null) {
                    components.push({ name: component.name, node: component })
                }
                for (const specifier of node.specifiers) {
                    if (specifier.type === "ExportSpecifier" && specifier.exported.type === "Identifier") {
                        exported.add(specifier.exported.name)
                    }
                }
            },
            "Program:exit"(program) {
                checkKebab(context, program, stem)
                checkFolder(context, program, folder, part, stem)
                checkFactory(context, program, factory, spec, feature, part, exported)
                checkComponents(context, expected, components)
            },
        }
    },
})
