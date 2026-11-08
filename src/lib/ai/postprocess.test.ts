import { describe, expect, it } from "vitest";
import { fallbackSuggestion } from "./fallback";
import { postProcess, truncateAtWord } from "./postprocess";

describe("Truncation", () => {
    it("keeps short texts untouched", () => {
        expect(truncateAtWord("Toiture en bambou", 60)).toBe(
            "Toiture en bambou",
        );
    });

    it("cuts at the last whole word and drops dangling small words", () => {
        expect(truncateAtWord("Vue aérienne du concours de bambou", 22)).toBe(
            "Vue aérienne",
        );
        expect(truncateAtWord("Charpente en bambou, lumière", 21)).toBe(
            "Charpente en bambou",
        );
    });
});

describe("Post-processing", () => {
    it("trims and removes quotes", () => {
        expect(
            postProcess("caption", "  « Toiture en bambou de nuit »  "),
        ).toBe("Toiture en bambou de nuit");
        expect(postProcess("alt", '"Charpente en bambou au crépuscule."')).toBe(
            "Charpente en bambou au crépuscule.",
        );
    });

    it("removes « Image de » style prefixes and capitalizes", () => {
        expect(postProcess("alt", "Image de charpente en bambou.")).toBe(
            "Charpente en bambou.",
        );
        expect(postProcess("alt", "Photo d'une façade en brique.")).toBe(
            "Une façade en brique.",
        );
        expect(postProcess("alt", "Cette image montre une cour plantée.")).toBe(
            "Une cour plantée.",
        );
        expect(postProcess("caption", "Légende : Vue aérienne")).toBe(
            "Vue aérienne",
        );
    });

    it("drops the final period of a caption only", () => {
        expect(postProcess("caption", "Toiture en bambou de nuit.")).toBe(
            "Toiture en bambou de nuit",
        );
        expect(postProcess("alt", "Toiture en bambou éclairée.")).toBe(
            "Toiture en bambou éclairée.",
        );
    });

    it("keeps only the first line", () => {
        expect(postProcess("caption", "\nCour intérieure\nAutre ligne")).toBe(
            "Cour intérieure",
        );
    });

    it("truncates to the field length at a word boundary", () => {
        const caption = postProcess(
            "caption",
            "Grande charpente en bambou tressé sous la lumière dorée du soir",
        );
        expect(caption.length).toBeLessThanOrEqual(60);
        expect(caption).toBe(
            "Grande charpente en bambou tressé sous la lumière dorée",
        );

        const alt = postProcess("alt", `Façade ${"très ".repeat(40)}longue.`);
        expect(alt.length).toBeLessThanOrEqual(125);
        expect(alt.endsWith("très")).toBe(true);
    });

    it("returns an empty string for an empty answer", () => {
        expect(postProcess("alt", "  \n ")).toBe("");
        expect(postProcess("caption", '""')).toBe("");
    });
});

describe("Fallback", () => {
    const project = { title: "Bambou U" };

    it("uses the project title as caption, or nothing", () => {
        expect(fallbackSuggestion("caption", { project })).toBe("Bambou U");
        expect(fallbackSuggestion("caption", {})).toBe("");
    });

    it("combines caption and project for the alt text", () => {
        expect(
            fallbackSuggestion("alt", {
                caption: "Toiture de nuit",
                project,
            }),
        ).toBe("Toiture de nuit, projet Bambou U");
        expect(fallbackSuggestion("alt", { project })).toBe("Projet Bambou U");
        expect(fallbackSuggestion("alt", { caption: "Toiture" })).toBe(
            "Toiture",
        );
        expect(fallbackSuggestion("alt", {})).toBe("");
    });
});
