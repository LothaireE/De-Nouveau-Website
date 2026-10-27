import { describe, expect, it } from "vitest";
import type { Project } from "@/payload-types";
import {
    fillLoneHalves,
    getHomeTileWidths,
    getProjectMeta,
    getStatusLabel,
} from "./projectDisplay";

describe("getStatusLabel", () => {
    it("shows the admin label rather than the stored value", () => {
        expect(getStatusLabel("délivré")).toBe("Livré");
        expect(getStatusLabel("en cours")).toBe("En cours");
        expect(getStatusLabel(null)).toBeNull();
    });
});

describe("getProjectMeta", () => {
    it("lists status then year, skipping empty values", () => {
        expect(
            getProjectMeta({ projectStatus: "concept", year: 2026 } as Project),
        ).toEqual(["Concept", "2026"]);
        expect(getProjectMeta({ year: 2026 } as Project)).toEqual(["2026"]);
    });
});

describe("fillLoneHalves", () => {
    it("widens a half left alone before a wide item or at the end", () => {
        expect(fillLoneHalves([false, true])).toEqual([true, true]);
        expect(fillLoneHalves([false, false, false])).toEqual([
            false,
            false,
            true,
        ]);
        expect(fillLoneHalves([false, false, true])).toEqual([
            false,
            false,
            true,
        ]);
    });
});

describe("getHomeTileWidths", () => {
    it("alternates two pairs and one full-width tile", () => {
        expect(getHomeTileWidths(7)).toEqual([
            false,
            false,
            false,
            false,
            true,
            false,
            false,
        ]);
    });

    it("never leaves a lone half tile", () => {
        expect(getHomeTileWidths(3)).toEqual([false, false, true]);
        expect(getHomeTileWidths(1)).toEqual([true]);
    });
});
