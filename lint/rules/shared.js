export function isUnderSrc(filename) {
    return /(^|\/)src\//.test(filename)
}

export function templateText(node) {
    return node.quasis.map((part) => part.value.cooked ?? "").join(" ")
}
