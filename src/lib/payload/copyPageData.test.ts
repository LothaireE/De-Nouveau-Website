import { describe, expect, it } from "vitest";
import type { Page } from "@/payload-types";
import { copyPageData, hasGlobalContent } from "./copyPageData";
describe("Copy protection", () => {
    it("retains media IDs and array IDs without mutating source documents", () => {
        const page = {
            id: 10,
            title: "About",
            portrait: 42,
            socialMedias: [{ id: "row-1", link: "https://example.com" }],
        } as Page;
        const before = structuredClone(page);
        const copy = copyPageData(page);
        expect(copy.portrait).toBe(42);
        expect(copy.socialMedias).toEqual(page.socialMedias);
        expect(copy).not.toHaveProperty("id");
        expect(page).toEqual(before);
    });
    it("protects partially edited Globals even if their title is still empty", () => {
        expect(
            hasGlobalContent({ title: "", email: "contact@example.com" }),
        ).toBe(true);
        expect(hasGlobalContent({ title: "", portrait: 42 })).toBe(true);
        expect(
            hasGlobalContent({
                id: 1,
                title: null,
                socialMedias: [],
                updatedAt: "today",
            }),
        ).toBe(false);
    });
});
