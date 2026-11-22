import { RuleTester } from "vite-plus/lint/plugins-dev"
import { describe, it } from "vite-plus/test"

import { featureNames } from "./feature-names.js"

RuleTester.describe = describe
RuleTester.it = it

const tester = new RuleTester({
    languageOptions: { parserOptions: { lang: "tsx" } },
})

tester.run("kk/feature-names", featureNames, {
    valid: [
        {
            name: "part file exports Feature + part",
            filename: "src/features/log/card.tsx",
            code: `export function LogCard() { return null }`,
        },
        {
            name: "feature entry exports the feature",
            filename: "src/features/header.tsx",
            code: `export function Header() { return null }`,
        },
        {
            name: "builder module exports the factory",
            filename: "src/features/log/create-filter.ts",
            code: `export function createLogFilter() { return null }`,
        },
        {
            name: "outside the features tree",
            filename: "src/ui/card.tsx",
            code: `export function AnythingGoes() { return null }`,
        },
    ],
    invalid: [
        {
            name: "component without its feature stem",
            filename: "src/features/log/card.tsx",
            code: `export function PostCard() { return null }`,
            errors: [{ messageId: "componentName" }],
        },
        {
            name: "file repeating the folder",
            filename: "src/features/log/log-list.tsx",
            code: `export function LogList() { return null }`,
            errors: [{ messageId: "repeatsFolder" }, { messageId: "componentName" }],
        },
        {
            name: "builder without the factory export",
            filename: "src/features/log/create-filter.ts",
            code: `export function filterLogs() { return null }`,
            errors: [{ messageId: "factoryExport" }],
        },
    ],
})
