import fs from "node:fs";
import { createHash } from "node:crypto";
import { parse } from "dotenv";
import pg from "pg";
const [envFile, output] = process.argv.slice(2);
if (!envFile || !output)
    throw new Error(
        "Usage: node scripts/database-snapshot.mjs ENV_FILE OUTPUT",
    );
const env = parse(fs.readFileSync(envFile));
const client = new pg.Client({
    connectionString: env.DATABASE_URL,
    options: "-c default_transaction_read_only=on",
});
await client.connect();
try {
    await client.query("BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY");
    const { rows: tables } = await client.query(
        "SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename",
    );
    const result = {};
    for (const { tablename } of tables) {
        const quoted = '"' + tablename.replaceAll('"', '""') + '"';
        const { rows } = await client.query(
            `SELECT row_to_json(t)::text AS value FROM public.${quoted} t ORDER BY row_to_json(t)::text`,
        );
        result[tablename] = {
            count: rows.length,
            sha256: createHash("sha256")
                .update(rows.map((row) => row.value).join("\n"))
                .digest("hex"),
        };
    }
    await client.query("COMMIT");
    fs.writeFileSync(output, JSON.stringify(result, null, 2) + "\n");
    console.log(
        `Read-only snapshot: ${tables.length} tables; only counts and hashes saved.`,
    );
} finally {
    await client.end();
}
