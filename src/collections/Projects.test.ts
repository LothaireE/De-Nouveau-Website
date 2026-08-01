import { describe, expect, it } from "vitest";
import { Projects } from "@/collections/Projects";

describe("Projects collection", () => {
    it("only allows images in project plans", () => {
        const plansField = Projects.fields.find(
            (field) => "name" in field && field.name === "plans",
        );

        if (!plansField || plansField.type !== "array") {
            throw new Error("Projects.plans array field is missing");
        }

        const imageField = plansField.fields.find(
            (field) => "name" in field && field.name === "image",
        );

        expect(imageField).toMatchObject({
            name: "image",
            type: "upload",
            relationTo: "media",
            filterOptions: {
                mediaType: {
                    equals: "image",
                },
            },
        });
    });
});
