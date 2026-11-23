import { RuleTester } from "vite-plus/lint/plugins-dev"
import { describe, it } from "vite-plus/test"

import { routeShape } from "./route-shape.js"

RuleTester.describe = describe
RuleTester.it = it

const tester = new RuleTester({
    languageOptions: { parserOptions: { lang: "tsx" } },
})

tester.run("kk/route-shape", routeShape, {
    valid: [
        {
            name: "static page exports its route",
            filename: "src/routes/about.tsx",
            code: `export default function AboutRoute() { return null }`,
        },
        {
            name: "generated page exports its route",
            filename: "src/routes/logs/[slug].tsx",
            code: `export default function LogRoute() { return null }`,
        },
        {
            name: "document endpoint exports its handler",
            filename: "src/routes/rss.xml.ts",
            code: `export function GET() { return new Response("x") }`,
        },
        {
            name: "api endpoint exports its handlers",
            filename: "src/routes/ask.ts",
            code: `export const GET = handle\nexport const POST = handle`,
        },
        {
            name: "outside the routes tree",
            filename: "src/features/log/article.tsx",
            code: `export function LogArticle() { return null }`,
        },
        {
            name: "route spec files hold tests, not routes",
            filename: "src/routes/cv.spec.tsx",
            code: `import { describe, it } from "vite-plus/test"`,
        },
    ],
    invalid: [
        {
            name: "page without a route export",
            filename: "src/routes/about.tsx",
            code: `export function About() { return null }`,
            errors: [{ messageId: "pageExport" }],
        },
        {
            name: "anonymous page export",
            filename: "src/routes/about.tsx",
            code: `export default function () { return null }`,
            errors: [{ messageId: "pageExport" }],
        },
        {
            name: "endpoint without a handler",
            filename: "src/routes/rss.xml.ts",
            code: `export const body = "x"`,
            errors: [{ messageId: "endpointExport" }],
        },
    ],
})
