import { revalidateRelated, revalidateRelatedDelete } from "@/hooks/revalidate";
import { createSlugField } from "@/fields/slug";
import type { CollectionConfig } from "payload";

export const Categories: CollectionConfig = {
    slug: "categories",
    labels: {
        singular: "Category",
        plural: "Categories",
    },
    admin: {
        hidden: true, // Preserve the collection and existing project relationships.
        useAsTitle: "title",
        defaultColumns: ["title", "slug"],
    },
    hooks: {
        afterChange: [revalidateRelated],
        afterDelete: [revalidateRelatedDelete],
    },
    fields: [
        {
            name: "title",
            label: "Title",
            type: "text",
            required: true,
        },
        createSlugField({
            admin: {
                position: "sidebar",
                description:
                    "Ce champ définit l’URL publique de la catégorie (slug). Il est généré automatiquement à partir du titre lors de la sauvegarde. Ne le modifiez que si vous avez un besoin spécifique. Utilisez uniquement des lettres minuscules, chiffres et tirets. Évitez les espaces, accents, caractères spéciaux et modifications fréquentes afin de ne pas casser les liens existants.",
                condition: () => false, // slug field is not displayed in the form
            },
        }),
    ],
};
