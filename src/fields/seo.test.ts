import { describe, expect, it } from "vitest";
import type { FieldAccess, Field } from "payload";
import { createSeoFields } from "./seo";
import { Users } from "@/collections/Users";
import { Projects } from "@/collections/Projects";
import { HomePage } from "@/globals/HomePage";
import { AboutPage } from "@/globals/AboutPage";
import { ContactPage } from "@/globals/ContactPage";
function nestedFields(fields: Field[]): Field[] {
    return fields.flatMap((field) =>
        "fields" in field ? nestedFields(field.fields) : [field],
    );
}
const args = (role?: string) =>
    ({ req: { user: role ? { role } : null } }) as Parameters<FieldAccess>[0];
describe("SEO permissions", () => {
    for (const legacy of [false, true]) {
        it(`protects both creation and update of SEO fields (legacy: ${legacy})`, async () => {
            const fields = nestedFields(createSeoFields(legacy, "home")).filter(
                (field) =>
                    "name" in field &&
                    ["seoTitle", "seoDescription"].includes(field.name),
            );
            expect(fields).toHaveLength(2);
            for (const field of fields) {
                if (!("access" in field))
                    throw new Error("Missing field access rules");
                for (const operation of ["create", "update"] as const) {
                    expect(
                        await field.access?.[operation]?.(args("editor")),
                    ).toBe(false);
                    expect(await field.access?.[operation]?.(args())).toBe(
                        false,
                    );
                    expect(
                        await field.access?.[operation]?.(args("admin")),
                    ).toBe(true);
                }
            }
        });
    }
    it("hides advanced settings for editors while leaving the preview visible", () => {
        const [section] = createSeoFields(false, "home");
        if (section.type !== "collapsible")
            throw new Error("SEO fields must be grouped in a collapsible");
        const fields = section.fields;
        const advanced = fields.find((field) => field.type === "collapsible");
        const condition = advanced?.admin?.condition;
        expect(
            condition?.({}, {}, { user: { role: "editor" } } as Parameters<
                NonNullable<typeof condition>
            >[2]),
        ).toBe(false);
        expect(
            condition?.({}, {}, { user: { role: "admin" } } as Parameters<
                NonNullable<typeof condition>
            >[2]),
        ).toBe(true);
        expect(fields[0].type).toBe("ui");
        expect(fields[0].admin?.condition).toBeUndefined();
    });
    it("prevents an editor from granting an administrator role through user creation", async () => {
        const role = Users.fields.find(
            (field) => "name" in field && field.name === "role",
        );
        if (!role || !("access" in role))
            throw new Error("Missing role access rules");
        expect(await role.access?.create?.(args("editor"))).toBe(false);
        expect(await role.access?.create?.(args("admin"))).toBe(true);
    });
});

describe("SEO placement", () => {
    it.each([
        ["Projets", Projects.fields],
        ["Accueil", HomePage.fields],
        ["À propos", AboutPage.fields],
        ["Contact", ContactPage.fields],
    ])("ends the %s form with a closed SEO section", (_name, fields) => {
        expect(fields.at(-1)).toMatchObject({
            type: "collapsible",
            label: "Référencement (SEO)",
            admin: { initCollapsed: true },
        });
    });
});
