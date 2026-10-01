import { describe, expect, it } from "vitest";
import { getLegalNoticeSections, SITE_HOSTING } from "@/library/legalNotice";

describe("getLegalNoticeSections", () => {
    it("shows only the hosting details when the agency has no legal data", () => {
        const sections = getLegalNoticeSections(null);

        expect(sections.map((section) => section.title)).toEqual([
            "Hébergement",
        ]);
        expect(sections[0].items[0]).toEqual({
            label: "Hébergeur",
            value: SITE_HOSTING.name,
        });
    });

    it("builds the publisher lines from the agency info and skips empty fields", () => {
        const sections = getLegalNoticeSections({
            email: " hello@studio.fr ",
            phone: "01 23 45 67 89",
            address: "1 rue de Paris\n75001 Paris",
            legal: {
                companyName: "De Nouveau",
                legalForm: "SARL d’architecture",
                shareCapital: " 10 000 € ",
                siret: "",
                architectsRegistration: "CROA Île-de-France, n° S12345",
                publicationDirector: "   ",
            },
        });
        const publisher = sections.find(
            (section) => section.title === "Éditeur du site",
        );

        expect(publisher?.items).toEqual([
            { label: "Raison sociale", value: "De Nouveau" },
            {
                label: "Forme juridique",
                value: "SARL d’architecture au capital de 10 000 €",
            },
            { label: "Siège social", value: "1 rue de Paris\n75001 Paris" },
            {
                label: "E-mail",
                value: "hello@studio.fr",
                href: "mailto:hello@studio.fr",
            },
            {
                label: "Téléphone",
                value: "01 23 45 67 89",
                href: "tel:0123456789",
            },
        ]);
        expect(sections.map((section) => section.title)).toEqual([
            "Éditeur du site",
            "Profession réglementée",
            "Hébergement",
        ]);
    });
});
