import "dotenv/config";
import fs from "node:fs";
import { getPayload } from "payload";
import config from "../src/payload.config";

// Schema generation only: no database connection, push, or reverse migration.
const target = "src/migrations/20260930_agency_legal_info.sql";
const payload = await getPayload({
    config,
    disableDBConnect: true,
    disableOnInit: true,
});
const { generateDrizzleJson, generateMigration } =
    payload.db.requireDrizzleKit();
const after = await generateDrizzleJson(payload.db.schema);
const before = structuredClone(after);
const table = before.tables["public.agency_info"];
const columns = Object.keys(table.columns).filter((name) =>
    name.startsWith("legal_"),
);
for (const column of columns) delete table.columns[column];
const statements = await generateMigration(before, after);
if (
    !statements.length ||
    statements.some(
        (statement) =>
            !/^ALTER TABLE "agency_info" ADD COLUMN "legal_\w+" varchar;$/.test(
                statement.trim(),
            ),
    )
) {
    throw new Error(
        "Schema generation did not produce only the expected legal columns.",
    );
}
if (fs.existsSync(target))
    throw new Error("Migration already exists; refusing to overwrite it.");
fs.writeFileSync(target, statements.join("\n") + "\n");
console.log(
    JSON.stringify({ newColumns: columns, statements: statements.length }),
);
process.exit(0);
