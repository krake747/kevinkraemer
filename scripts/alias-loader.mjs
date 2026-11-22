import { readFileSync, statSync } from "node:fs"
import { registerHooks } from "node:module"
import { join, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const root = fileURLToPath(new URL("../", import.meta.url))

function stripGlob(value) {
    return value.endsWith("*") ? value.slice(0, -1) : value
}

const tsconfig = JSON.parse(readFileSync(join(root, "tsconfig.json"), "utf8"))

const aliases = Object.entries(tsconfig.compilerOptions.paths)
    .map(([key, targets]) => {
        const first = targets[0]
        if (first === undefined) {
            throw new Error(`tsconfig paths entry ${key} has no targets`)
        }
        return [stripGlob(key), stripGlob(first)]
    })
    .toSorted(([a], [b]) => {
        return b.length - a.length
    })

const extensions = [".ts", ".tsx", ".mts", ".cts", ".js", ".mjs", ".jsx", ".cjs", ".json"]

function isFile(path) {
    try {
        return statSync(path).isFile()
    } catch {
        return false
    }
}

function probe(base) {
    if (isFile(base)) {
        return base
    }
    for (const extension of extensions) {
        const candidate = `${base}${extension}`
        if (isFile(candidate)) {
            return candidate
        }
    }
    for (const extension of extensions) {
        const candidate = join(base, `index${extension}`)
        if (isFile(candidate)) {
            return candidate
        }
    }
    return undefined
}

registerHooks({
    resolve(specifier, context, nextResolve) {
        for (const [prefix, target] of aliases) {
            if (!specifier.startsWith(prefix)) {
                continue
            }
            const rest = specifier.slice(prefix.length)
            const file = probe(resolve(root, target, rest))
            if (file) {
                return { url: pathToFileURL(file).href, shortCircuit: true }
            }
        }
        if ((specifier.startsWith("./") || specifier.startsWith("../")) && context.parentURL?.startsWith("file:")) {
            const base = resolve(fileURLToPath(context.parentURL).replace(/\/[^/]*$/, ""), specifier)
            const file = probe(base)
            if (file) {
                return { url: pathToFileURL(file).href, shortCircuit: true }
            }
        }
        return nextResolve(specifier, context)
    },
})
