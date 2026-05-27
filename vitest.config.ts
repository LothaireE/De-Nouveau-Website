import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
    test: {
        // environment: "node",
        // setupFiles: ["./vitest.setup.ts"],
        projects: [
            {
                test: {
                    name: "unit",
                    environment: "jsdom",
                    include: ["src/**/*.test.tsx", "src/**/*.spec.tsx"],
                    setupFiles: ["./vitest.setup.ts"],
                },
                resolve: {
                    alias: {
                        "@": path.resolve(__dirname, "./src"),
                    },
                },
            },
            {
                test: {
                    name: "integration",
                    environment: "node",
                    include: [
                        "src/**/*.test.ts",
                        "src/**/*.spec.ts",
                        "src/tests/integration/**/*.test.ts",
                    ],
                    setupFiles: ["./vitest.setup.ts"],
                },
                resolve: {
                    alias: {
                        "@": path.resolve(__dirname, "./src"),
                        "@payload-config": path.resolve(
                            __dirname,
                            "./src/payload.config.ts",
                        ),
                    },
                },
            },
        ],
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@payload-config": path.resolve(
                __dirname,
                "./src/payload.config.ts",
            ),
        },
    },
});
