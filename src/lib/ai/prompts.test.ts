import { describe, expect, it } from "vitest";
import {
    MAX_LENGTH,
    describeProject,
    getSystemPrompt,
    getUserPrompt,
} from "./prompts";

const project = {
    title: "Bambou U",
    location: "Hanoï",
    year: 2024,
    shortDescription: "Une université en bambou.",
    projectStatus: "concept",
    categories: ["Concours", "Éducation"],
};

describe("System prompts", () => {
    it("asks for a short noun phrase for the caption", () => {
        const prompt = getSystemPrompt("caption");
        expect(prompt).toContain("légende");
        expect(prompt).toContain(`${MAX_LENGTH.caption} caractères`);
        expect(prompt).toContain("Toiture en bambou de nuit");
        expect(prompt).toMatch(/N'invente jamais/);
    });

    it("asks for a factual description that does not repeat the caption", () => {
        const prompt = getSystemPrompt("alt");
        expect(prompt).toContain("texte alternatif");
        expect(prompt).toContain(`${MAX_LENGTH.alt} caractères`);
        expect(prompt).toMatch(/ne répète PAS la légende/);
        expect(prompt).toContain("Image de");
    });

    it("limits the alt text to what is clearly visible, people included when relevant", () => {
        const prompt = getSystemPrompt("alt");
        expect(prompt).toMatch(/Ne décris que ce qui est clairement visible/);
        expect(prompt).toMatch(/personnes sont présentes/);
        expect(getSystemPrompt("caption")).not.toMatch(/personnes/);
    });
});

describe("User prompts", () => {
    it("includes every known project fact", () => {
        const prompt = getUserPrompt("caption", { project });
        for (const fact of [
            "Titre : Bambou U",
            "Lieu : Hanoï",
            "Année : 2024",
            "Statut : concept",
            "Catégories : Concours, Éducation",
            "Description courte : Une université en bambou.",
        ])
            expect(prompt).toContain(fact);
    });

    it("says when no project data is available", () => {
        expect(getUserPrompt("caption", {})).toContain(
            "Aucune donnée de projet",
        );
        expect(describeProject(null)).toEqual([]);
        expect(describeProject({ title: "  ", categories: [""] })).toEqual([]);
    });

    it("gives the alt prompt the current caption so it is not repeated", () => {
        const prompt = getUserPrompt("alt", {
            caption: "Toiture en bambou de nuit",
            project,
        });
        expect(prompt).toContain("« Toiture en bambou de nuit »");
        expect(prompt).toContain("à ne pas répéter");
        expect(prompt).toContain("Titre : Bambou U");
    });

    it("notes a missing caption in the alt prompt", () => {
        expect(getUserPrompt("alt", {})).toContain("pas encore de légende");
    });

    it("maps the stored status to readable French", () => {
        expect(describeProject({ projectStatus: "délivré" }).join()).toContain(
            "Statut : livré",
        );
    });
});
