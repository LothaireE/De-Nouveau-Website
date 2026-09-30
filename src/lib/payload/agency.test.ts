import { beforeEach, describe, expect, it, vi } from "vitest";
const { findGlobal } = vi.hoisted(() => ({ findGlobal: vi.fn() }));
vi.mock("./payload", () => ({
    getPayloadClient: async () => ({ findGlobal }),
}));
import { getAgencyInfo } from "./agency";
describe("Shared agency coordinates", () => {
    beforeEach(() => vi.clearAllMocks());
    it("reads the common global without exposing migration metadata", async () => {
        findGlobal.mockResolvedValue({
            email: "studio@example.com",
            phone: "+33123456789",
            address: "Paris",
            socialMedias: [{ link: "https://example.com", label: "Studio" }],
            legal: { companyName: "Studio", siret: null },
            initialized: true,
        });
        expect(await getAgencyInfo()).toEqual({
            email: "studio@example.com",
            phone: "+33123456789",
            address: "Paris",
            socialMedias: [{ link: "https://example.com", label: "Studio" }],
            legal: { companyName: "Studio", siret: null },
        });
        expect(findGlobal).toHaveBeenCalledWith({
            slug: "agency-info",
            depth: 0,
        });
    });
    it("keeps deliberately cleared coordinates empty", async () => {
        findGlobal.mockResolvedValue({
            email: null,
            phone: "",
            address: null,
            socialMedias: [],
        });
        expect(await getAgencyInfo()).toEqual({
            email: null,
            phone: "",
            address: null,
            socialMedias: [],
            legal: {},
        });
    });
});
