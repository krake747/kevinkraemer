export function isUnderSrc(filename) {
    return /(^|\/)src\//.test(filename)
}

export function isUiOrPatternTsx(filename) {
    if (typeof filename !== "string") {
        return false
    }
    if (!filename.endsWith(".tsx")) {
        return false
    }
    return filename.includes("src/ui/") || filename.includes("src/pattern/")
}

export function templateText(node) {
    return node.quasis.map((part) => part.value.cooked ?? "").join(" ")
}
