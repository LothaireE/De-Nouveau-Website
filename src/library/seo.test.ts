import { describe, expect, it } from "vitest";
import { createMetadata, DEFAULT_OG_IMAGE, SITE_URL } from "@/library/seo";

describe("createMetadata", () => {
    it("uses denouveau.fr for canonical and default social URLs", () => {
        const metadata = createMetadata({
            title: "À propos — De Nouveau",
            description: "Présentation du studio",
            path: "/about",
            locale: "fr_FR",
        });

        expect(metadata.metadataBase?.toString()).toBe(`${SITE_URL}/`);
        expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/about`);
        expect(metadata.openGraph?.url).toBe(`${SITE_URL}/about`);
        expect(metadata.openGraph?.images).toEqual([
            expect.objectContaining({
                url: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
                width: 1200,
                height: 630,
            }),
        ]);
    });

    it("keeps an absolute project image URL", () => {
        const image = "https://media.example.com/project-cover.webp";
        const metadata = createMetadata({
            title: "Projet — De Nouveau",
            description: "Description du projet",
            path: "/projet",
            locale: "fr_FR",
            image,
        });

        expect(metadata.twitter?.images).toEqual([image]);
    });
});
