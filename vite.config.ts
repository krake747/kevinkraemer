import solid from "@solidjs/vite-plugin"
import tailwindcss from "@tailwindcss/vite"
import { fileRoutes } from "filesystem-routing/vite"
import { defineConfig, lazyPlugins } from "vite-plus"

export default defineConfig({
    fmt: {
        printWidth: 120,
        tabWidth: 4,
        semi: false,
        bracketSameLine: false,
        sortImports: true,
        sortPackageJson: true,
        sortTailwindcss: {
            stylesheet: "src/app.css",
        },
        overrides: [
            {
                files: ["*.yml", "*.yaml"],
                options: {
                    tabWidth: 2,
                },
            },
            {
                files: ["*.md"],
                options: {
                    printWidth: 100,
                    tabWidth: 2,
                    proseWrap: "always",
                },
            },
        ],
        ignorePatterns: ["pnpm-lock.yaml"],
    },
    lint: {
        plugins: ["oxc", "typescript", "unicorn", "import", "jsx-a11y", "vitest"],
        settings: {
            solid: { version: 2 },
        },
        options: {
            typeAware: true,
            typeCheck: true,
        },
        categories: {
            correctness: "error",
            suspicious: "warn",
            perf: "off",
        },
        rules: {
            curly: ["error", "all"],
            "typescript/consistent-type-definitions": ["error", "type"],
            "typescript/consistent-type-imports": [
                "error",
                { fixStyle: "inline-type-imports", prefer: "type-imports" },
            ],
            "unicorn/filename-case": ["error", { case: "kebabCase" }],
            "import/extensions": "off",
            "import/no-duplicates": "error",
            "import/no-nodejs-modules": "error",
            "jsx-a11y/alt-text": "error",
            "jsx-a11y/anchor-ambiguous-text": "warn",
            "no-unassigned-vars": "off",
            "vitest/no-conditional-expect": "error",
            "vitest/require-mock-type-parameters": "error",
            "import/no-unassigned-import": "off",
            "vite-plus/prefer-vite-plus-imports": "error",
            "kk/cva-class-prop": "error",
            "kk/no-describe-function-title": "error",
            "kk/strict-types": "error",
            "kk/no-prose-comments": "error",
            "kk/feature-names": "error",
            "kk/no-class-string-const": "error",
            "kk/component-props-omit": "error",
            "kk/no-content-element-props": "error",
            "kk/no-styles-import": "error",
            "kk/alias-imports": "error",
            "kk/no-transition-all": "error",
            "kk/no-raw-color": "error",
            "kk/no-separate-leading": "error",
            "kk/route-seo-path": "error",
            "kk/route-shape": "error",
            "vitest/consistent-test-it": ["error", { fn: "it", withinDescribe: "it" }],
            "solid/jsx-no-duplicate-props": "error",
            "solid/jsx-no-undef": "error",
            "solid/no-unassigned-vars": "error",
            "solid/no-unknown-namespaces": "error",
            "solid/validate-jsx-nesting": "error",
            "solid/no-innerhtml": "error",
            "solid/jsx-no-script-url": "error",
            "solid/no-destructure": "error",
            "solid/prefer-for": "error",
            "solid/removed-api": "error",
            "solid/no-single-arg-create-effect": "error",
            "solid/no-store-mutation-outside-setter": "error",
            "solid/no-write-in-pure-computation": "error",
            "solid/no-accessor-as-prop": "error",
            "solid/no-boolean-enumerated-attribute": "error",
            "solid/no-react-specific-props": "error",
            "solid/event-handlers": "error",
            "solid/valid-use-server": "error",
            "solid/require-async-server-function": "error",
            "solid/no-invalid-server-capture": "error",
            "solid/no-browser-globals-in-server-function": "error",
            "solid/components-return-once": "warn",
            "solid/reactivity": "warn",
            "solid/imports": "warn",
            "solid/style-prop": "warn",
            "solid/self-closing-comp": "warn",
            "solid/no-unused-signal": "warn",
            "solid/prefer-structured-class": "warn",
            "shadcn/no-unknown-classes": [
                "warn",
                {
                    allow: ["log-entry", "hero-intro", "not-prose", "reveal-section"],
                },
            ],
            "no-restricted-properties": [
                "error",
                {
                    property: "toLocaleString",
                    message: "Pin the locale: use Intl.NumberFormat or Intl.DateTimeFormat with an explicit locale.",
                },
                {
                    property: "toLocaleDateString",
                    message: "Pin the locale: use Intl.DateTimeFormat with an explicit locale.",
                },
                {
                    property: "toLocaleTimeString",
                    message: "Pin the locale: use Intl.DateTimeFormat with an explicit locale.",
                },
                {
                    property: "localeCompare",
                    message: "Pin the locale: use Intl.Collator with an explicit locale.",
                },
            ],
        },
        overrides: [
            {
                files: ["e2e/**"],
                rules: {
                    "vitest/consistent-test-it": "off",
                },
            },
            {
                files: [
                    "**/*.spec.ts",
                    "**/*.spec.tsx",
                    "e2e/prerendered-routes.ts",
                    "vite.config.ts",
                    "vitest.config.ts",
                    "vitest.setup.ts",
                    "playwright.config.ts",
                ],
                rules: {
                    "import/no-nodejs-modules": "off",
                },
            },
            {
                files: [
                    "src/document.tsx",
                    "src/features/home/about.tsx",
                    "src/features/log/body.tsx",
                    "src/features/log/no-script.tsx",
                ],
                rules: {
                    "solid/no-innerhtml": "off",
                },
            },
        ],
        ignorePatterns: ["dist", "scripts/**", "!scripts/**/*.spec.ts"],
        jsPlugins: [
            {
                name: "kk",
                specifier: "./lint/plugin.js",
            },
            {
                name: "vite-plus",
                specifier: "vite-plus/oxlint-plugin",
            },
            {
                name: "solid",
                specifier: "eslint-plugin-solid",
            },
            {
                name: "shadcn",
                specifier: "@shadcn/lint",
            },
        ],
    },
    plugins: lazyPlugins(() => [
        solid({
            start: {
                app: "./src/app.tsx",
                document: "./src/document.tsx",
                middleware: "./src/middleware.ts",
            },
            ssr: true,
        }),
        fileRoutes({ httpMethods: true }),
        tailwindcss(),
    ]),
    resolve: { tsconfigPaths: true },
    optimizeDeps: { exclude: ["@ui-sdk/core"] },
})
