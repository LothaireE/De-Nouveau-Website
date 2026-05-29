import {
    assignProjectToMedia,
    formatSlug,
    revalidateFrontend,
} from "@/library/payload/hooks";
import type { CollectionConfig } from "payload";

export const Projects: CollectionConfig = {
    slug: "projects",
    hooks: {
        afterChange: [
            assignProjectToMedia,
            async ({ doc }) => {
                await revalidateFrontend(`/${doc.slug}`);
                await revalidateFrontend("/");
            },
        ],
    },
    labels: {
        singular: "Project",
        plural: "Projects",
    },
    admin: {
        useAsTitle: "title",
        defaultColumns: ["title", "status", "featured", "order"],
    },
    fields: [
        {
            name: "projectLayout",
            label: "Project layout",
            type: "select",
            required: true,
            defaultValue: "default",
            options: [
                { label: "Default", value: "default" },
                { label: "Editorial", value: "editorial" },
                { label: "Gallery focused", value: "galleryFocused" },
                { label: "Minimal", value: "minimal" },
            ],
            admin: {
                description:
                    "Définit la mise en page du projet côté site : Default - page projet classique | Editorial - texte et images alternées | Gallery focused - galerie dominante, peu de texte | Minimal - titre et quelques images, très peu d’infos",
            },
        },
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
            required: true,
            access: {
                update: ({ req }) => {
                    return req.user?.role === "admin";
                },
            },
            admin: {
                position: "sidebar",
                description:
                    "Ce champ définit l’URL publique du projet (slug). Il est généré automatiquement à partir du titre lors de la sauvegarde. Ne le modifiez que si vous avez un besoin spécifique. Utilisez uniquement des lettres minuscules, chiffres et tirets. Évitez les espaces, accents, caractères spéciaux et modifications fréquentes afin de ne pas casser les liens existants. Seul un administrateur peut modifier ce champ.",
            },
            hooks: {
                beforeValidate: [formatSlug("title")],
            },
        },

        {
            name: "coverImage",
            label: "Cover image",
            type: "upload",
            relationTo: "media",
            required: true,
        },
        {
            name: "galleryImages",
            label: "Gallery images",
            type: "array",
            fields: [
                {
                    name: "image",
                    label: "Image",
                    type: "upload",
                    relationTo: "media",
                },
            ],
        },
        {
            name: "video",
            label: "Video",
            type: "text",
        },
        {
            name: "shortDescription",
            label: "Short description",
            type: "textarea",
            required: true,
            maxLength: 300,
        },
        {
            name: "longDescription",
            label: "Long description",
            type: "richText",
        },
        {
            name: "location",
            label: "Location",
            type: "text",
        },
        {
            name: "year",
            label: "Year",
            type: "number",
            defaultValue: new Date().getFullYear(),
        },
        {
            name: "categories",
            label: "Categories",
            type: "relationship",
            relationTo: "categories",
            hasMany: true,
        },
        {
            name: "surface",
            label: "Surface",
            type: "text",
        },
        {
            name: "client",
            label: "Client",
            type: "text",
        },
        {
            name: "status",
            label: "Status",
            type: "radio",
            options: [
                { label: "Completed", value: "completed" },
                { label: "In progress", value: "inProgress" },
                { label: "Concept", value: "concept" },
            ],
        },
        {
            name: "seoTitle",
            label: "SEO title",
            type: "text",
        },
        {
            name: "seoDescription",
            label: "SEO description",
            type: "textarea",
        },
        {
            name: "plans",
            label: "Plans / Dessins",
            type: "array",
            maxRows: 3,
            admin: {
                description:
                    "Ajouter jusqu’à 3 plans (ex : plan masse, plan RDC, plan étage) qui seront affichés dans une section dédiée du projet.",
            },
            fields: [
                {
                    name: "image",
                    type: "upload",
                    relationTo: "media",
                    //   required: true,
                },
            ],
        },

        {
            name: "planDetails",
            label: "Détail des plans",
            type: "richText",
            admin: {
                description:
                    "Description des plans et dessins : listes, paragraphes, etc.",
            },
        },
    ],
};
