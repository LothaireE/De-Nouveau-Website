import { describe, expect, it } from "vitest";
import {
    getProjectSeo,
    getStaticPageSeo,
    normalizeSeoText,
    staticPageSeo,
    summarizeDescription,
} from "./seoContent";

describe("Automatic SEO", () => {
    it("normalizes editorial whitespace without rewriting the content", () => {
        expect(
            getProjectSeo({
                title: "  Maison\n  patio ",
                shortDescription: " Un patio\u00a0  ouvert.\n ",
            }),
        ).toEqual({
            title: "Maison patio — De Nouveau",
            description: "Un patio ouvert.",
        });
        expect(normalizeSeoText(undefined)).toBe("");
    });
    it("keeps a complete first sentence when the rest is too long", () => {
        const sentence =
            "Cette maison organise ses espaces autour d’un patio et fait entrer la lumière au cœur des pièces.";
        expect(
            summarizeDescription(
                sentence +
                    " " +
                    "Une seconde phrase beaucoup plus longue ".repeat(8),
            ),
        ).toBe(sentence);
    });
    it("ends a long single sentence at a word boundary", () => {
        const description = "Une maison lumineuse ".repeat(20);
        const result = summarizeDescription(description);
        expect(result.length).toBeLessThanOrEqual(160);
        expect(result.endsWith("…")).toBe(true);
        expect(description.startsWith(result.slice(0, -1) + " ")).toBe(true);
    });
    it("does not split a single long token or output empty metadata", () => {
        const token = "a".repeat(200);
        expect(summarizeDescription(token)).toBe(token);
        expect(
            getProjectSeo({ title: "Maison", shortDescription: " " })
                .description,
        ).toBe(
            "Découvrez Maison, un projet du studio d’architecture et de design De Nouveau.",
        );
    });
    it("uses curated page defaults unless an administrator has supplied an override", () => {
        expect(
            getStaticPageSeo("contact", {
                seoTitle: " ",
                seoDescription: null,
            }),
        ).toEqual(staticPageSeo.contact);
        expect(
            getStaticPageSeo("about", {
                seoTitle: " Notre\n studio ",
                seoDescription: "Une description dédiée.",
            }),
        ).toEqual({
            title: "Notre studio",
            description: "Une description dédiée.",
            path: "/about",
        });
    });
});
