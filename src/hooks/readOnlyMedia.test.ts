import { describe, expect, it } from "vitest";
import { protectSharedMedia } from "./readOnlyMedia";
describe("Shared media protection", () => {
    for (const operation of ["create", "update", "delete"] as const) {
        it(`blocks ${operation} even when invoked outside access rules`, () => {
            expect(() =>
                protectSharedMedia({ operation } as Parameters<
                    typeof protectSharedMedia
                >[0]),
            ).toThrow("lecture seule");
        });
    }
    it("allows reads", () => {
        expect(() =>
            protectSharedMedia({ operation: "read" } as Parameters<
                typeof protectSharedMedia
            >[0]),
        ).not.toThrow();
    });
});
