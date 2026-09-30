import "dotenv/config";
import fs from "node:fs";
import { createHash } from "node:crypto";
import pg from "pg";
import { assertIsolatedDatabase } from "../src/lib/payload/isolation";
assertIsolatedDatabase();
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
    console.log(
        (await client.query("SELECT current_database() AS database")).rows[0],
    );
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(20260926)");
    await client.query(
        "CREATE TABLE IF NOT EXISTS admin_refactor_migrations (name text PRIMARY KEY, checksum text, applied_at timestamptz DEFAULT now())",
    );
    for (const name of [
        "20260926_admin_globals",
        "20260930_featured_projects",
        "20260930_agency_info",
        "20260930_agency_legal_info",
    ]) {
        const migration = fs.readFileSync(`src/migrations/${name}.sql`, "utf8");
        if (
            /(?:^|;)\s*(DROP|TRUNCATE|DELETE|UPDATE)\b|\bDROP\s+(TABLE|COLUMN|TYPE)\b/i.test(
                migration,
            )
        )
            throw new Error("Non-additive SQL refused.");
        const checksum = createHash("sha256").update(migration).digest("hex");
        const { rows } = await client.query(
            "SELECT checksum FROM admin_refactor_migrations WHERE name=$1",
            [name],
        );
        if (rows.length) {
            if (rows[0].checksum !== checksum)
                throw new Error(
                    "Applied migration checksum differs; refusing to proceed.",
                );
            console.log("Migration already applied; no schema changes.");
        } else {
            await client.query(migration);
            await client.query(
                "INSERT INTO admin_refactor_migrations (name, checksum) VALUES ($1, $2)",
                [name, checksum],
            );
            console.log(`Additive migration applied: ${name}.`);
        }
    }
    await client.query("COMMIT");
} catch (error) {
    await client.query("ROLLBACK");
    throw error;
} finally {
    await client.end();
}
