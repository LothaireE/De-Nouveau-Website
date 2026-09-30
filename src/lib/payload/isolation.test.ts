import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
    assertConfiguredDatabaseTarget,
    assertDatabaseTarget,
    isIsolatedEnvironment,
    isMediaReadOnly,
} from "./isolation";

const PRODUCTION = "ep-still-brook-a23szb07-pooler.eu-central-1.aws.neon.tech";
const url = (host: string) => `postgresql://example:example@${host}/neondb`;

// Run each test from a temporary folder, with or without the refactor guard file.
function useFolder(guardHost?: string) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "isolation-"));
    if (guardHost)
        fs.writeFileSync(
            path.join(dir, ".refactor-isolation.json"),
            JSON.stringify({ databaseHost: guardHost }),
        );
    vi.spyOn(process, "cwd").mockReturnValue(dir);
}

beforeEach(() => {
    vi.stubEnv("PAYLOAD_EXPECTED_DATABASE_HOST", "");
    vi.stubEnv("PAYLOAD_MEDIA_READ_ONLY", "");
    vi.stubEnv("PAYLOAD_DROP_DATABASE", "");
});
afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
});

describe("Refactor worktree (guard file present)", () => {
    it("keeps media read-only and checks the dedicated database", () => {
        useFolder("dedicated.example.com");
        expect(isIsolatedEnvironment()).toBe(true);
        expect(isMediaReadOnly()).toBe(true);

        vi.stubEnv("DATABASE_URL", url("dedicated.example.com"));
        expect(assertConfiguredDatabaseTarget).not.toThrow();
        vi.stubEnv("DATABASE_URL", url("other.example.com"));
        expect(assertConfiguredDatabaseTarget).toThrow("Refusing to connect");
    });

    it("rejects the production endpoint even if configured as expected", () => {
        useFolder(PRODUCTION);
        vi.stubEnv("DATABASE_URL", url(PRODUCTION));
        expect(assertConfiguredDatabaseTarget).toThrow("Refusing to connect");
        expect(assertDatabaseTarget).toThrow("Refusing to connect");
    });
});

describe("Original project (no guard file)", () => {
    it("runs the app normally with writable media when nothing is configured", () => {
        useFolder();
        vi.stubEnv("DATABASE_URL", url(PRODUCTION));
        expect(isIsolatedEnvironment()).toBe(false);
        expect(isMediaReadOnly()).toBe(false);
        expect(assertConfiguredDatabaseTarget).not.toThrow();
    });

    it("keeps media read-only on demand for a local copy of the database", () => {
        useFolder();
        vi.stubEnv("PAYLOAD_MEDIA_READ_ONLY", "true");
        expect(isMediaReadOnly()).toBe(true);
    });

    it("checks the app target when one is configured", () => {
        useFolder();
        vi.stubEnv("PAYLOAD_EXPECTED_DATABASE_HOST", "dev.example.com");
        vi.stubEnv("DATABASE_URL", url("other.example.com"));
        expect(assertConfiguredDatabaseTarget).toThrow("Refusing to connect");
    });

    it("refuses data scripts until the target database is named", () => {
        useFolder();
        vi.stubEnv("DATABASE_URL", url("dev.example.com"));
        expect(assertDatabaseTarget).toThrow(
            "Configure the dedicated database",
        );

        vi.stubEnv("PAYLOAD_EXPECTED_DATABASE_HOST", "dev.example.com");
        expect(assertDatabaseTarget).not.toThrow();
    });
});

it("always refuses destructive initialization", () => {
    useFolder();
    vi.stubEnv("PAYLOAD_DROP_DATABASE", "true");
    expect(assertConfiguredDatabaseTarget).toThrow(
        "Destructive database operations are disabled",
    );
    expect(assertDatabaseTarget).toThrow(
        "Destructive database operations are disabled",
    );
});
