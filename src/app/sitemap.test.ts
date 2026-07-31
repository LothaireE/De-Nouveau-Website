import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGetSitemapProjects = vi.fn();

vi.mock("@/library/payload/fetchers", () => ({
    getSitemapProjects: () => mockGetSitemapProjects(),
}));

import sitemap from "@/app/sitemap";

describe("sitemap", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("includes static pages and public Payload projects", async () => {
        mockGetSitemapProjects.mockResolvedValue([
            {
                slug: "maison-contemporaine",
                updatedAt: "2026-07-30T10:00:00.000Z",
            },
        ]);

        const entries = await sitemap();

        expect(entries).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ url: "https://www.denouveau.fr" }),
                expect.objectContaining({
                    url: "https://www.denouveau.fr/about",
                }),
                expect.objectContaining({
                    url: "https://www.denouveau.fr/contact",
                }),
                expect.objectContaining({
                    url: "https://www.denouveau.fr/maison-contemporaine",
                    lastModified: "2026-07-30T10:00:00.000Z",
                }),
            ]),
        );
        expect(entries).toHaveLength(4);
    });

    it("still returns static pages when Payload is empty", async () => {
        mockGetSitemapProjects.mockResolvedValue([]);

        await expect(sitemap()).resolves.toHaveLength(3);
    });
});
