import type { Field, GlobalConfig } from "payload";
import { isAuthenticated } from "@/access";
import { createGlobalPageFields } from "@/fields/globalPage";
import { revalidateGlobal } from "@/hooks/revalidate";

const CONTACT_FIELDS = ["email", "phone", "address", "socialMedias"];

const isCustom = (data: { contactDetails?: string } | undefined) =>
    data?.contactDetails === "custom";

/**
 * The page shows the agency details by default. "Personnaliser" reveals the
 * page's own contact fields (kept in the database since the admin refactor):
 * they can be prefilled from the agency details, edited, or left empty, and
 * an empty field is not shown on the site.
 */
const contactDetailsFields: Field[] = [
    {
        name: "contactDetails",
        label: "Coordonnées affichées",
        type: "radio",
        defaultValue: "agency",
        options: [
            {
                label: "Reprendre les informations de l’agence",
                value: "agency",
            },
            { label: "Personnaliser pour cette page", value: "custom" },
        ],
        admin: {
            description:
                "En mode personnalisé, un champ laissé vide n’est pas affiché sur la page Contact.",
        },
    },
    {
        name: "copyAgencyContact",
        type: "ui",
        admin: {
            condition: (data) => isCustom(data),
            components: {
                Field: "@/components/admin/CopyAgencyContact#CopyAgencyContact",
            },
        },
    },
];

function withContactDetails(fields: Field[]): Field[] {
    return fields.flatMap((field) => {
        if (!("name" in field) || !CONTACT_FIELDS.includes(field.name))
            return [field];

        const visible = {
            ...field,
            admin: {
                ...field.admin,
                hidden: false,
                condition: (data: { contactDetails?: string }) =>
                    isCustom(data),
            },
        } as Field;

        return field.name === "email"
            ? [...contactDetailsFields, visible]
            : [visible];
    });
}

export const ContactPage: GlobalConfig = {
    slug: "contact-page",
    label: "Contact",
    admin: { group: "Pages du site" },
    access: { read: () => true, update: isAuthenticated },
    hooks: { afterChange: [revalidateGlobal("/")] },
    fields: withContactDetails(createGlobalPageFields("contact")),
};
