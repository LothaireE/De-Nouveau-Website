import "dotenv/config";
import "@testing-library/jest-dom/vitest";

process.env.PAYLOAD_SECRET ??= "test-secret";
