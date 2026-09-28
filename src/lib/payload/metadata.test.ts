import { describe, expect, it, vi } from "vitest";
const { getPage } = vi.hoisted(() => ({ getPage: vi.fn() }));
vi.mock("./fetchers", () => ({ getPage }));
import { getPageMetadata } from "./metadata";
import { staticPageSeo } from "@/library/seoContent";
describe("Page metadata", () => {
    it("publishes the automatic title consistently across search and sharing", async () => {
        getPage.mockResolvedValue({ seoTitle: " ", seoDescription: null });
        const metadata = await getPageMetadata("home");
        expect(metadata.title).toBe(staticPageSeo.home.title);
        expect(metadata.description).toBe(staticPageSeo.home.description);
        expect(metadata.openGraph?.title).toBe(metadata.title);
        expect(metadata.twitter?.description).toBe(metadata.description);
    });
    it("preserves an existing administrator override", async () => {
        getPage.mockResolvedValue({
            seoTitle: " Titre personnalisé ",
            seoDescription: "Texte\n personnalisé",
        });
        const metadata = await getPageMetadata("contact");
        expect(metadata.title).toBe("Titre personnalisé");
        expect(metadata.description).toBe("Texte personnalisé");
        expect(metadata.alternates?.canonical).toBe(
            "https://www.denouveau.fr/contact",
        );
    });
});
