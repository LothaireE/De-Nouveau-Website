import "dotenv/config";
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

process.env.PAYLOAD_SECRET ??= "test-secret";

afterEach(() => {
    cleanup();
});
