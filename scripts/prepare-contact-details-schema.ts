import "dotenv/config";
import fs from "node:fs";
import { getPayload } from "payload";
import config from "../src/payload.config";

// Schema generation only: no database connection, push, or reverse migration.
const target = "src/migrations/20261026_contact_details.sql";
const payload = await getPayload({
    config,
    disableDBConnect: true,
    disableOnInit: true,
});
const { generateDrizzleJson, generateMigration } =
    payload.db.requireDrizzleKit();
const after = await generateDrizzleJson(payload.db.schema);
const before = structuredClone(after);
delete before.tables["public.contact_page"].columns.contact_details;
delete before.enums["public.enum_contact_page_contact_details"];
const statements = await generateMigration(before, after);
const expected = [
    /^CREATE TYPE "public"\."enum_contact_page_contact_details" AS ENUM\('agency', 'custom'\);$/,
    /^ALTER TABLE "contact_page" ADD COLUMN "contact_details" "enum_contact_page_contact_details" DEFAULT 'agency';$/,
];
if (
    statements.length !== expected.length ||
    statements.some(
        (statement, index) => !expected[index].test(statement.trim()),
    )
) {
    console.error(statements);
    throw new Error(
        "Schema generation did not produce only the expected contact column.",
    );
}
if (fs.existsSync(target))
    throw new Error("Migration already exists; refusing to overwrite it.");
fs.writeFileSync(target, statements.join("\n") + "\n");
console.log(JSON.stringify({ statements: statements.length }));
process.exit(0);
