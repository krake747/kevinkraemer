export const escapeXml = (value: string): string =>
    value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&apos;")

export function xml(body: string): Response {
    return new Response(body, {
        headers: { "Content-Type": "application/xml" },
    })
}

export function json(body: string): Response {
    return new Response(body, {
        headers: { "Content-Type": "application/json; charset=utf-8" },
    })
}

export function text(body: string): Response {
    return new Response(body, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
}

export function html(body: string): Response {
    return new Response(body, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
    })
}
