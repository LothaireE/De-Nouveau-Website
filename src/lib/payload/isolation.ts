import fs from "node:fs";
import path from "node:path";

// The original production endpoint, refused outright in the isolated refactor worktree.
const PRODUCTION_ENDPOINT =
    "ep-still-brook-a23szb07.eu-central-1.aws.neon.tech";

const guardPath = () => path.resolve(process.cwd(), ".refactor-isolation.json");

/** True in the refactor worktree, identified by its untracked guard file. */
export function isIsolatedEnvironment() {
    return fs.existsSync(guardPath());
}

/** Media stay read-only where the storage is shared with another environment. */
export function isMediaReadOnly() {
    return (
        isIsolatedEnvironment() ||
        process.env.PAYLOAD_MEDIA_READ_ONLY === "true"
    );
}

function getExpectedDatabaseHost(): string | undefined {
    if (process.env.PAYLOAD_EXPECTED_DATABASE_HOST)
        return process.env.PAYLOAD_EXPECTED_DATABASE_HOST;
    return isIsolatedEnvironment()
        ? JSON.parse(fs.readFileSync(guardPath(), "utf8")).databaseHost
        : undefined;
}

function checkDatabaseTarget(expected: string | undefined) {
    if (process.env.PAYLOAD_DROP_DATABASE === "true")
        throw new Error("Destructive database operations are disabled.");
    const raw = process.env.DATABASE_URL;
    if (!expected || !raw)
        throw new Error(
            "Configure the dedicated database host before starting Payload.",
        );
    const host = new URL(raw).hostname;
    if (
        host !== expected ||
        (isIsolatedEnvironment() &&
            host.replace("-pooler", "") === PRODUCTION_ENDPOINT)
    ) {
        throw new Error(
            "Refusing to connect: DATABASE_URL does not point to the expected database.",
        );
    }
}

/**
 * Scripts that write data fail closed: the target host must be named, either in
 * PAYLOAD_EXPECTED_DATABASE_HOST or in the refactor guard file.
 */
export function assertDatabaseTarget() {
    checkDatabaseTarget(getExpectedDatabaseHost());
}

/** The app checks its target only where one is configured (refactor, opt-in elsewhere). */
export function assertConfiguredDatabaseTarget() {
    if (process.env.PAYLOAD_DROP_DATABASE === "true")
        throw new Error("Destructive database operations are disabled.");
    const expected = getExpectedDatabaseHost();
    if (expected) checkDatabaseTarget(expected);
}
