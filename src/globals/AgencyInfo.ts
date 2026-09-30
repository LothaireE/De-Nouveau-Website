import type { Field, GlobalConfig } from "payload";
import { isAuthenticated } from "@/access";
import { legalInfoField } from "@/fields/legal";
import { createPageFields } from "@/fields/page";
import { revalidateGlobal } from "@/hooks/revalidate";

export const AgencyInfo: GlobalConfig = {
    slug: "agency-info",
    label: "Informations de l’agence",
    admin: {
        group: "Réglages du site",
        description:
            "Coordonnées et informations légales communes à tout le site.",
    },
    access: { read: () => true, update: isAuthenticated },
    hooks: { afterChange: [revalidateGlobal("/")] },
    fields: [
        {
            // Unnamed tabs keep the existing field paths and columns unchanged.
            type: "tabs",
            tabs: [
                {
                    label: "Coordonnées",
                    fields: createPageFields()
                        .filter(
                            (field) =>
                                "name" in field &&
                                [
                                    "email",
                                    "phone",
                                    "address",
                                    "socialMedias",
                                ].includes(field.name),
                        )
                        .map(
                            (field) =>
                                ({
                                    ...field,
                                    admin: {},
                                }) as Field,
                        ),
                },
                { label: "Mentions légales", fields: [legalInfoField] },
            ],
        },
        {
            name: "initialized",
            type: "checkbox",
            defaultValue: false,
            admin: { hidden: true },
        },
    ],
};
