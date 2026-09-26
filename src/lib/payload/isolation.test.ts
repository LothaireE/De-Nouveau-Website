import { afterEach, describe, expect, it, vi } from "vitest";
import { assertIsolatedDatabase } from "./isolation";
afterEach(() => vi.unstubAllEnvs());
describe("Database isolation", () => {
    it("rejects the original endpoint even if configured as the expected host", () => {
        const host =
            "ep-still-brook-a23szb07-pooler.eu-central-1.aws.neon.tech";
        vi.stubEnv("PAYLOAD_EXPECTED_DATABASE_HOST", host);
        vi.stubEnv(
            "DATABASE_URL",
            `postgresql://example:example@${host}/neondb`,
        );
        expect(assertIsolatedDatabase).toThrow("Refusing to connect");
    });
    it("rejects an unexpected endpoint before connecting", () => {
        vi.stubEnv("PAYLOAD_EXPECTED_DATABASE_HOST", "dedicated.example.com");
        vi.stubEnv(
            "DATABASE_URL",
            "postgresql://example:example@other.example.com/neondb",
        );
        expect(assertIsolatedDatabase).toThrow("Refusing to connect");
    });
    it("allows the explicitly configured copy and rejects destructive initialization", () => {
        vi.stubEnv("PAYLOAD_EXPECTED_DATABASE_HOST", "dedicated.example.com");
        vi.stubEnv(
            "DATABASE_URL",
            "postgresql://example:example@dedicated.example.com/neondb",
        );
        expect(assertIsolatedDatabase).not.toThrow();
        vi.stubEnv("PAYLOAD_DROP_DATABASE", "true");
        expect(assertIsolatedDatabase).toThrow(
            "Destructive database operations are disabled",
        );
    });
});
