import { afterEach, describe, expect, it, vi } from "vitest";
import type { Page, Project } from "@/payload-types";
import {
    createOrganizationStructuredData,
    createProjectStructuredData,
    ORGANIZATION_ID,
} from "@/library/structuredData";

afterEach(() => {
    vi.unstubAllEnvs();
});

describe("structured data", () => {
    it("describes the studio from existing contact information", () => {
        const contactPage = {
            email: "studio@denouveau.fr",
            phone: "+33 1 23 45 67 89",
            address: "10 rue Exemple\n75000 Paris\n",
            socialMedias: [
                { link: "https://www.instagram.com/denouveau/" },
                { link: "javascript:alert('xss')" },
            ],
        } as Page;

        expect(createOrganizationStructuredData(contactPage)).toEqual(
            expect.objectContaining({
                "@type": "Organization",
                "@id": ORGANIZATION_ID,
                email: "studio@denouveau.fr",
                telephone: "+33 1 23 45 67 89",
                address: "10 rue Exemple\n75000 Paris",
                sameAs: ["https://www.instagram.com/denouveau/"],
            }),
        );
    });

    it("describes a project with its media and architectural information", () => {
        vi.stubEnv(
            "NEXT_PUBLIC_S3_PUBLIC_DEV_URL",
            "https://media.denouveau.fr",
        );
        const project = {
            title: "Maison contemporaine",
            slug: "maison-contemporaine",
            shortDescription: "Rénovation d'une maison familiale.",
            coverImage: {
                filename: "maison.webp",
                sizes: {
                    hero: { filename: "maison-hero.webp" },
                },
            },
            categories: [{ title: "Rénovation" }, 42],
            location: "Paris, France",
            year: 2026,
            projectStatus: "délivré",
            updatedAt: "2026-07-31T10:00:00.000Z",
        } as Project;

        expect(createProjectStructuredData(project)).toEqual(
            expect.objectContaining({
                "@type": "CreativeWork",
                "@id": "https://www.denouveau.fr/maison-contemporaine#project",
                creator: { "@id": ORGANIZATION_ID },
                image: "https://media.denouveau.fr/media/maison-hero.webp",
                keywords: ["Rénovation"],
                contentLocation: {
                    "@type": "Place",
                    name: "Paris, France",
                },
                temporalCoverage: "2026",
            }),
        );
    });
});
