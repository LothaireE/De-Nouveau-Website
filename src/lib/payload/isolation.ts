import fs from "node:fs";
import path from "node:path";

/** Fail closed: every Payload entry point must target the explicitly selected copy. */
export function assertIsolatedDatabase() {
    if (process.env.PAYLOAD_DROP_DATABASE === "true")
        throw new Error("Destructive database operations are disabled.");
    const guardPath = path.resolve(process.cwd(), ".refactor-isolation.json");
    const expected =
        process.env.PAYLOAD_EXPECTED_DATABASE_HOST ||
        (fs.existsSync(guardPath)
            ? JSON.parse(fs.readFileSync(guardPath, "utf8")).databaseHost
            : undefined);
    const raw = process.env.DATABASE_URL;
    if (!expected || !raw)
        throw new Error(
            "Configure the dedicated database host before starting Payload.",
        );
    const host = new URL(raw).hostname;
    if (
        host !== expected ||
        host.replace("-pooler", "") ===
            "ep-still-brook-a23szb07.eu-central-1.aws.neon.tech"
    ) {
        throw new Error(
            "Refusing to connect: DATABASE_URL does not point to the dedicated refactor database.",
        );
    }
}
