import type { Field, GlobalConfig } from "payload";
import { isAuthenticated } from "@/access";
import { createPageFields } from "@/fields/page";
import { revalidateGlobal } from "@/hooks/revalidate";

export const AgencyInfo: GlobalConfig = {
    slug: "agency-info",
    label: "Informations de l’agence",
    admin: {
        group: "Réglages du site",
        description: "Coordonnées communes à toutes les pages du site.",
    },
    access: { read: () => true, update: isAuthenticated },
    hooks: { afterChange: [revalidateGlobal("/")] },
    fields: [
        ...createPageFields()
            .filter(
                (field) =>
                    "name" in field &&
                    ["email", "phone", "address", "socialMedias"].includes(
                        field.name,
                    ),
            )
            .map(
                (field) =>
                    ({
                        ...field,
                        admin: {},
                    }) as Field,
            ),
        {
            name: "initialized",
            type: "checkbox",
            defaultValue: false,
            admin: { hidden: true },
        },
    ],
};
