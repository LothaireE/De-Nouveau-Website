import "dotenv/config";
import assert from "node:assert/strict";
import { createLocalReq, getPayload } from "payload";
import config from "../src/payload.config";

const payload = await getPayload({ config });
try {
    const transactionID = await payload.db.beginTransaction();
    if (!transactionID) throw new Error("A transaction is required.");
    const req = await createLocalReq(
        { context: { disableRevalidate: true } },
        payload,
    );
    req.transactionID = transactionID;
    try {
        const existing = await payload.findGlobal({
            slug: "agency-info",
            depth: 0,
            req,
        });
        if (
            existing.initialized ||
            existing.email ||
            existing.phone ||
            existing.address ||
            existing.socialMedias?.length
        ) {
            console.log(
                "Agency information already initialized; left unchanged.",
            );
        } else {
            const readSources = async () => {
                const pages = [];
                for (const slug of [
                    "contact-page",
                    "about-page",
                    "home-page",
                ] as const) {
                    pages.push(
                        await payload.findGlobal({ slug, depth: 0, req }),
                    );
                }
                const legacy = await payload.find({
                    collection: "pages",
                    depth: 0,
                    limit: 100,
                    req,
                });
                return { pages, legacy: legacy.docs };
            };
            const before = await readSources();
            // Current Contact is authoritative; other pages only fill missing values.
            const sources = [...before.pages, ...before.legacy];
            const text = (key: "email" | "phone" | "address") =>
                sources.find((page) => page[key]?.trim())?.[key] ?? null;
            const seen = new Set<string>();
            const socialMedias = sources
                .flatMap((page) => page.socialMedias ?? [])
                .filter((row) => {
                    const key = row.link?.trim();
                    if (!key || seen.has(key)) return false;
                    seen.add(key);
                    return true;
                })
                .map(({ link, label }) => ({ link, label }));
            const data = {
                email: text("email"),
                phone: text("phone"),
                address: text("address"),
                socialMedias,
                initialized: true,
            };
            const saved = await payload.updateGlobal({
                slug: "agency-info",
                data,
                depth: 0,
                req,
            });
            for (const key of ["email", "phone", "address"] as const)
                assert.equal(saved[key] ?? null, data[key]);
            assert.deepEqual(
                saved.socialMedias?.map(({ link, label }) => ({
                    link,
                    label,
                })) ?? [],
                socialMedias,
            );
            assert.deepEqual(
                await readSources(),
                before,
                "Original pages must remain unchanged.",
            );
            console.log(
                "Agency information copied and verified; source pages unchanged.",
            );
        }
        await payload.db.commitTransaction(transactionID);
    } catch (error) {
        await payload.db.rollbackTransaction(transactionID);
        throw error;
    }
} finally {
    await payload.destroy();
}
process.exit(0);
