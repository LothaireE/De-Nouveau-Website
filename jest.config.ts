import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
    testEnvironment: "jsdom",

    testMatch: [
        "<rootDir>/src/tests/frontend/**/*.test.{ts,tsx}",
        "<rootDir>/src/tests/backend/**/*.test.{ts,tsx}",
    ],

    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },

    transformIgnorePatterns: ["/node_modules/(?!payload|@payloadcms)/"],
};
// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
