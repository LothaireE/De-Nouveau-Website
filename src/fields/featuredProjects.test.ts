import { describe, expect, it } from "vitest";
import type { ArrayFieldValidation } from "payload";
import { featuredProjectsField } from "./featuredProjects";
const validate = featuredProjectsField.validate as ArrayFieldValidation;
const options = {} as Parameters<ArrayFieldValidation>[1];
describe("Featured project validation", () => {
    it("allows zero to three distinct projects but refuses a fourth", async () => {
        expect(await validate([], options)).toBe(true);
        expect(
            await validate(
                [{ project: 1 }, { project: 2 }, { project: 3 }],
                options,
            ),
        ).toBe(true);
        expect(
            await validate(
                [1, 2, 3, 4].map((project) => ({ project })),
                options,
            ),
        ).toBe("Sélectionnez au maximum 3 projets.");
        expect(featuredProjectsField.maxRows).toBe(3);
    });
    it("requires a project in each row", async () => {
        expect(await validate([{ project: null }], options)).toBe(
            "Choisissez un projet pour chaque ligne.",
        );
    });
    it("refuses duplicate references, including populated references", async () => {
        expect(
            await validate([{ project: 1 }, { project: { id: 1 } }], options),
        ).toBe("Chaque projet ne peut être sélectionné qu’une fois.");
    });
    it("restricts the picker and prevents drafts from being populated in public globals", () => {
        expect(featuredProjectsField.fields[0]).toMatchObject({
            maxDepth: 0,
            filterOptions: {
                and: [
                    { _status: { equals: "published" } },
                    { visibility: { equals: "show" } },
                ],
            },
        });
    });
});
