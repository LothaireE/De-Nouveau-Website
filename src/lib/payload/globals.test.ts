import { beforeEach, describe, expect, it, vi } from "vitest";
const { find, findGlobal } = vi.hoisted(() => ({
    find: vi.fn(),
    findGlobal: vi.fn(),
}));
vi.mock("./payload", () => ({
    getPayloadClient: async () => ({ find, findGlobal }),
}));
vi.mock("./agency", () => ({
    getAgencyInfo: async () => ({
        email: "shared@example.com",
        phone: null,
        address: null,
        socialMedias: [],
    }),
}));
import { getPage } from "./globals";
describe("Global page reads", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it("falls back to the original page when the Global is empty", async () => {
        findGlobal.mockResolvedValue({ id: 1, title: null });
        find.mockResolvedValue({
            docs: [{ id: 4, title: "Original", slug: "about" }],
        });
        expect(await getPage("about")).toMatchObject({
            id: 4,
            title: "Original",
            email: "shared@example.com",
        });
    });
    it("uses a populated Global and preserves deliberately cleared fields", async () => {
        findGlobal.mockResolvedValue({
            id: 2,
            title: "New",
            content: null,
            socialMedias: [],
        });
        expect(await getPage("about")).toMatchObject({
            title: "New",
            slug: "about",
            pageType: "about",
            content: null,
            socialMedias: [],
        });
        expect(find).not.toHaveBeenCalled();
    });
    it("does not hide infrastructure errors as empty content", async () => {
        findGlobal.mockRejectedValue(new Error("database unavailable"));
        await expect(getPage("home")).rejects.toThrow("database unavailable");
        expect(find).not.toHaveBeenCalled();
    });
});
