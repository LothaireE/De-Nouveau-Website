import { formatSlug } from "@/library/payload/formatSlug";
import type { CollectionConfig } from "payload";

export const Categories: CollectionConfig = {
    slug: "categories",
    labels: {
        singular: "Category",
        plural: "Categories",
    },
    admin: {
        useAsTitle: "title",
        defaultColumns: ["title", "slug"],
    },
    fields: [
        {
            name: "title",
            label: "Title",
            type: "text",
            required: true,
        },
        {
            name: "slug",
            label: "Slug",
            type: "text",
            unique: true,
            hooks: {
                beforeValidate: [formatSlug("title")],
            },
            admin: {
                position: "sidebar",
                description:
                    "Ce champ définit l’URL publique de la catégorie (slug). Il est généré automatiquement à partir du titre lors de la sauvegarde. Ne le modifiez que si vous avez un besoin spécifique. Utilisez uniquement des lettres minuscules, chiffres et tirets. Évitez les espaces, accents, caractères spéciaux et modifications fréquentes afin de ne pas casser les liens existants.",
            },
        },
    ],
};
