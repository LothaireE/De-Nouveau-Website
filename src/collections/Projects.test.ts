import { describe, expect, it, vi } from "vitest";
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

describe("Project year default", () => {
    it("uses the year at creation time, not at server start", () => {
        const yearField = Projects.fields.find(
            (field) => "name" in field && field.name === "year",
        );
        if (!yearField || !("defaultValue" in yearField))
            throw new Error("Projects.year field is missing");
        const defaultValue = yearField.defaultValue as () => number;

        vi.useFakeTimers();
        try {
            vi.setSystemTime(new Date("2026-12-31T12:00:00"));
            expect(defaultValue()).toBe(2026);
            vi.setSystemTime(new Date("2027-01-02T12:00:00"));
            expect(defaultValue()).toBe(2027);
        } finally {
            vi.useRealTimers();
        }
    });
});
