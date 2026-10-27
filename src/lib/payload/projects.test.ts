import { beforeEach, describe, expect, it, vi } from "vitest";

const mockFind = vi.fn();

vi.mock("./payload", () => ({
    getPayloadClient: async () => ({ find: mockFind }),
}));

import { getNextProject } from "./projects";

const docs = ["a", "b", "c"].map((slug) => ({ slug, title: slug }));

describe("getNextProject", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockFind.mockResolvedValue({ docs });
    });

    it("returns the following visible project in the site order", async () => {
        await expect(getNextProject("a")).resolves.toEqual(docs[1]);
        expect(mockFind).toHaveBeenCalledWith(
            expect.objectContaining({
                collection: "projects",
                sort: "order",
                where: {
                    and: [
                        { _status: { equals: "published" } },
                        { visibility: { equals: "show" } },
                    ],
                },
            }),
        );
    });

    it("wraps from the last project to the first", async () => {
        await expect(getNextProject("c")).resolves.toEqual(docs[0]);
    });

    it("returns nothing for an unknown or lone project", async () => {
        await expect(getNextProject("inconnu")).resolves.toBeNull();

        mockFind.mockResolvedValue({ docs: [docs[0]] });
        await expect(getNextProject("solo")).resolves.toBeNull();
    });
});
