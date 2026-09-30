import "dotenv/config";
import fs from "node:fs";
import { randomBytes } from "node:crypto";
import { getPayload } from "payload";
import { assertDatabaseTarget } from "../src/lib/payload/isolation";
import config from "../src/payload.config";

// Local test account for the isolated refactor database only.
assertDatabaseTarget();
const file = ".refactor-test-admin.json";
const email = "admin-test@denouveau.test";
const payload = await getPayload({ config });
const { totalDocs } = await payload.count({
    collection: "users",
    where: { email: { equals: email } },
});
if (totalDocs > 0) {
    console.log(`Test admin already exists; credentials stay in ${file}.`);
} else {
    const password = randomBytes(18).toString("base64url");
    await payload.create({
        collection: "users",
        data: {
            email,
            password,
            role: "admin",
            firstName: "Admin",
            lastName: "Test",
        },
    });
    fs.writeFileSync(
        file,
        JSON.stringify({ email, password }, null, 2) + "\n",
        {
            mode: 0o600,
        },
    );
    console.log(`Test admin created; credentials saved in ${file}.`);
}
process.exit(0);
