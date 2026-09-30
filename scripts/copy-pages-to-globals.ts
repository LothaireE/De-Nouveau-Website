import "dotenv/config";
import assert from "node:assert/strict";
import { createLocalReq, getPayload } from "payload";
import config from "../src/payload.config";
import { assertDatabaseTarget } from "../src/lib/payload/isolation";
import { globalPages } from "../src/lib/payload/globals";
import {
    copyPageData,
    hasGlobalContent,
} from "../src/lib/payload/copyPageData";
// Writes data: the target database must be named explicitly.
assertDatabaseTarget();
const payload = await getPayload({ config });
try {
    const transactionID = await payload.db.beginTransaction();
    if (!transactionID)
        throw new Error("A transaction is required for the copy.");
    const req = await createLocalReq(
        { context: { disableRevalidate: true } },
        payload,
    );
    req.transactionID = transactionID;
    try {
        const source = await payload.find({
            collection: "pages",
            depth: 0,
            limit: 100,
            req,
        });
        for (const [slug, mapping] of Object.entries(globalPages)) {
            const page = source.docs.find(
                (page) =>
                    page.slug === slug && page.pageType === mapping.pageType,
            );
            if (!page) throw new Error(`Missing source page: ${slug}`);
            const existing = await payload.findGlobal({
                slug: mapping.global,
                depth: 0,
                req,
            });
            if (
                hasGlobalContent(existing as unknown as Record<string, unknown>)
            ) {
                console.log(
                    `${mapping.global}: already populated; left unchanged.`,
                );
                continue;
            }
            const data = copyPageData(page);
            const copied = await payload.updateGlobal({
                slug: mapping.global,
                data,
                depth: 0,
                req,
            });
            for (const key of Object.keys(data)) {
                assert.deepEqual(
                    (copied as unknown as Record<string, unknown>)[key] ?? null,
                    data[key],
                    `${slug}.${key}`,
                );
            }
            console.log(
                `${mapping.global}: content and media references copied and verified.`,
            );
        }
        const after = await payload.find({
            collection: "pages",
            depth: 0,
            limit: 100,
            req,
        });
        assert.deepEqual(
            after.docs,
            source.docs,
            "Source pages must remain unchanged.",
        );
        await payload.db.commitTransaction(transactionID);
        console.log("Copy transaction committed; source pages unchanged.");
    } catch (error) {
        await payload.db.rollbackTransaction(transactionID);
        throw error;
    }
} finally {
    await payload.destroy();
}
// Payload 3 retains a lifetime Postgres connection; mirror its CLI after awaited work.
process.exit(0);
