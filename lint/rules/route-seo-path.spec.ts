import { RuleTester } from "vite-plus/lint/plugins-dev"
import { describe, it } from "vite-plus/test"

import { routeSeoPath } from "./route-seo-path.js"

RuleTester.describe = describe
RuleTester.it = it

const tester = new RuleTester({
    languageOptions: { parserOptions: { lang: "tsx" } },
})

tester.run("kk/route-seo-path", routeSeoPath, {
    valid: [
        {
            name: "static page with the file's path",
            filename: "src/routes/about.tsx",
            code: `export default function AboutRoute() { return <Seo path="/about" /> }`,
        },
        {
            name: "index page with the root path",
            filename: "src/routes/index.tsx",
            code: `export default function HomeRoute() { return <Seo path="/" /> }`,
        },
        {
            name: "section index with the section path",
            filename: "src/routes/logs/index.tsx",
            code: `export default function LogsRoute() { return <Seo path="/logs" /> }`,
        },
        {
            name: "generated page with a content-derived path",
            filename: "src/routes/logs/[slug].tsx",
            code: "export default function LogRoute() { return <DetailPage seo={{ path: `/logs/${id}` }} /> }",
        },
        {
            name: "not-found page carries no canonical path",
            filename: "src/routes/[...404].tsx",
            code: `export default function NotFoundRoute() { return <Seo title="lost" /> }`,
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
        {
            name: "route witness matching the file",
            filename: "src/routes/cv.tsx",
            code: `export const route = defineFileRoute("/cv", { info: { sections: [] } })
                export default function CvRoute() { return <Seo path="/cv" /> }`,
        },
        {
            name: "generated page witness skips the literal check",
            filename: "src/routes/logs/[slug].tsx",
            code: `export const route = defineFileRoute("/logs/:slug")
                export default function LogRoute() { return <DetailPage seo={{ path: \`/logs/\${id}\` }} /> }`,
        },
    ],
    invalid: [
        {
            name: "static page with a drifted path",
            filename: "src/routes/about.tsx",
            code: `export default function AboutRoute() { return <Seo path="/cv" /> }`,
            errors: [{ messageId: "seoPathMismatch" }],
        },
        {
            name: "static page without a path",
            filename: "src/routes/about.tsx",
            code: `export default function AboutRoute() { return <Seo title="about" /> }`,
            errors: [{ messageId: "seoPath" }],
        },
        {
            name: "page without Seo",
            filename: "src/routes/about.tsx",
            code: `export default function AboutRoute() { return null }`,
            errors: [{ messageId: "seoPath" }],
        },
        {
            name: "generated page without a path",
            filename: "src/routes/logs/[slug].tsx",
            code: "export default function LogRoute() { return <DetailPage seo={{ title: id }} /> }",
            errors: [{ messageId: "seoPath" }],
        },
        {
            name: "route witness drifted from the file",
            filename: "src/routes/cv.tsx",
            code: `export const route = defineFileRoute("/about", { info: { sections: [] } })
                export default function CvRoute() { return <Seo path="/cv" /> }`,
            errors: [{ messageId: "witnessMismatch" }],
        },
    ],
})
