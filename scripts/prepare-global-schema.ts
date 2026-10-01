import "dotenv/config";
import fs from "node:fs";
import { getPayload } from "payload";
import config from "../src/payload.config";

// Schema generation only: no database connection, push, or reverse migration.
const payload = await getPayload({
    config,
    disableDBConnect: true,
    disableOnInit: true,
});
const { generateDrizzleJson, generateMigration } =
    payload.db.requireDrizzleKit();
const after = await generateDrizzleJson(payload.db.schema);
const before = structuredClone(after);
const tables = Object.keys(before.tables).filter((name) =>
    /^public\.(home_page|about_page|contact_page)(_|$)/.test(name),
);
for (const table of tables) delete before.tables[table];
const statements = await generateMigration(before, after);
if (
    !statements.length ||
    statements.some((statement) =>
        /(?:^|;)\s*(DROP|TRUNCATE|DELETE|UPDATE)\b|\bDROP\s+(TABLE|COLUMN|TYPE)\b/i.test(
            statement,
        ),
    )
) {
    throw new Error(
        "Schema generation did not produce an exclusively additive migration.",
    );
}
fs.writeFileSync(
    "src/migrations/20260926_admin_globals.sql",
    statements.join("\n") + "\n",
);
console.log(
    JSON.stringify({ newTables: tables, statements: statements.length }),
);
process.exit(0);
