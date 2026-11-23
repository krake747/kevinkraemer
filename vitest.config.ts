import solid from "@solidjs/vite-plugin"
import { defineConfig } from "vite-plus"
import { playwright } from "vite-plus/test/browser-playwright"

export default defineConfig({
    plugins: [solid()],
    resolve: { tsconfigPaths: true },
    test: {
        exclude: ["node_modules", "dist"],
        pool: "vmThreads",
        projects: [
            {
                test: {
                    name: "unit",
                    environment: "node",
                    include: [
                        "src/**/*.{test,spec}.{ts,tsx}",
                        "netlify/**/*.spec.ts",
                        "scripts/**/*.spec.ts",
                        "lint/**/*.spec.ts",
                    ],
                    exclude: ["**/*.browser.spec.{ts,tsx}"],
                },
            },
            {
                test: {
                    name: "browser",
                    setupFiles: ["./vitest.setup.ts"],
                    include: ["src/**/*.browser.spec.{ts,tsx}"],
                    browser: {
                        enabled: true,
                        headless: true,
                        provider: playwright(),
                        instances: [{ browser: "chromium" }],
                    },
                },
            },
        ],
        coverage: {
            provider: "v8",
            reporter: ["text", "html", "json-summary"],
            include: ["src/core/**"],
            exclude: ["src/core/**/*.spec-cases.ts"],
            thresholds: {
                lines: 75,
                branches: 70,
                functions: 65,
                statements: 75,
            },
        },
    },
})
