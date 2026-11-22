import { readdirSync, readFileSync, statSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..")
const features = join(root, "src", "features")

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/
const COMPONENT_EXPORT = /^export function ([A-Z][A-Za-z0-9]*)/gm
const EXPORT = /^export (?:async )?(?:function|const|type|class) ([A-Za-z0-9_]+)/gm

function pascal(stem) {
    return stem
        .split("-")
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join("")
}

function camel(stem) {
    const name = pascal(stem)
    return name[0].toLowerCase() + name.slice(1)
}

const failures = []

for (const folder of readdirSync(features).sort()) {
    const directory = join(features, folder)
    if (!statSync(directory).isDirectory()) {
        continue
    }

    const feature = pascal(folder)

    for (const file of readdirSync(directory).sort()) {
        if (!/\.(ts|tsx)$/.test(file)) {
            continue
        }

        const spec = file.includes(".spec.")
        const stem = file.replace(/\.spec\.(ts|tsx)$/, "").replace(/\.(ts|tsx)$/, "")
        const at = `src/features/${folder}/${file}`
        const source = readFileSync(join(directory, file), "utf8")
        const components = [...source.matchAll(COMPONENT_EXPORT)].map((match) => match[1])
        const exports = [...source.matchAll(EXPORT)].map((match) => match[1])
        const factory = stem.startsWith("create-")
        const part = factory ? stem.slice("create-".length) : stem

        if (!KEBAB.test(stem)) {
            failures.push(`${at}  file name is not kebab-case`)
        }

        if (stem !== folder && (part === folder || part.startsWith(`${folder}-`))) {
            failures.push(`${at}  file name repeats the "${folder}" folder`)
        }

        const built = `create${feature}${pascal(part)}`
        const named = `create${feature}`
        const accepted = feature.endsWith(pascal(part)) ? [built, named] : [built]
        if (factory && !spec && !accepted.some((name) => exports.includes(name))) {
            failures.push(`${at}  a create-* module must export ${built}`)
        }

        const expected = stem === folder ? feature : `${feature}${pascal(part)}`
        for (const component of components) {
            if (!component.startsWith(expected) && !expected.startsWith(component)) {
                failures.push(`${at}  ${component} is not named for ${feature} + ${pascal(part)}`)
            }
        }
    }
}

if (failures.length > 0) {
    console.error(failures.join("\n"))
    console.error(`\nfeature-names check failed with ${failures.length} finding(s)`)
    process.exit(1)
}

console.log("feature-names check passed")
