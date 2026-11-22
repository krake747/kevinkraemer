import solid from "@solidjs/vite-plugin"
import { defineConfig } from "vite-plus"

export default defineConfig({
    plugins: [solid()],
    resolve: { tsconfigPaths: true },
    test: {
        setupFiles: ["./vitest.setup.ts"],
        exclude: ["node_modules", "dist"],
        environment: "happy-dom",
        include: ["src/**/*.{test,spec}.{ts,tsx}", "netlify/**/*.spec.ts", "scripts/**/*.spec.ts"],
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
