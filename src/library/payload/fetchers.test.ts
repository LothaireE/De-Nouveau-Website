import { beforeEach, describe, expect, it, vi } from "vitest";

const mockFind = vi.fn();

vi.mock("@/library/payload/client", () => ({
    getPayloadClient: async () => ({ find: mockFind }),
}));

import { getSitemapProjects } from "@/library/payload/fetchers";

describe("getSitemapProjects", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("requests only published and visible project URLs", async () => {
        const projects = [
            {
                slug: "maison-contemporaine",
                updatedAt: "2026-07-30T10:00:00.000Z",
            },
        ];
        mockFind.mockResolvedValue({ docs: projects });

        await expect(getSitemapProjects()).resolves.toEqual(projects);
        expect(mockFind).toHaveBeenCalledWith({
            collection: "projects",
            where: {
                and: [
                    { _status: { equals: "published" } },
                    { visibility: { equals: "show" } },
                ],
            },
            select: {
                slug: true,
                updatedAt: true,
            },
            depth: 0,
            limit: 1000,
        });
    });
});
