import { describe, expect, it } from "vitest";
import { getPayload } from "payload";
import configPromise from "@payload-config";

describe("fetchers", () => {
    it("fetches projects from Payload", async () => {
        const payload = await getPayload({
            config: configPromise,
        });

        const result = await payload.find({
            collection: "projects",
            limit: 2,
        });

        expect(Array.isArray(result.docs)).toBe(true);
    });

    it("fetches categories from Payload", async () => {
        const payload = await getPayload({
            config: configPromise,
        });

        const result = await payload.find({
            collection: "categories",
            limit: 2,
        });

        expect(Array.isArray(result.docs)).toBe(true);

        for (const category of result.docs) {
            expect(category).toHaveProperty("id");
            expect(category).toHaveProperty("title");
            expect(category).toHaveProperty("slug");
        }
    });
});
