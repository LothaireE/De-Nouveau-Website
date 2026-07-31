import {
    assignProjectToMedia,
    formatSlug,
    revalidateFrontend,
} from "@/library/payload/hooks";
import type { CollectionConfig } from "payload";

async function revalidateProjectRoutes(slug: string) {
    await Promise.all([
        revalidateFrontend(`/${slug}`),
        revalidateFrontend("/"),
        revalidateFrontend("/sitemap.xml"),
    ]);
}

export const Projects: CollectionConfig = {
    slug: "projects",
    access: {
        read: ({ req: { user } }) => {
            // return true;
            if (user) {
                return true;
            }
            return {
                _status: {
                    equals: "published",
                },
            };
        },

        update: ({ req: { user } }) => {
            // return true;
            if (!user) return false;

            if (user.role === "admin") return true;

            return {
                _status: {
                    equals: "published",
                },
            };
        },
    },
    versions: {
        drafts: true,
    },
    hooks: {
        afterChange: [
            assignProjectToMedia,
            async ({ doc }) => {
                await revalidateProjectRoutes(doc.slug);
            },
        ],
        afterDelete: [
            async ({ doc }) => {
                await revalidateProjectRoutes(doc.slug);
            },
        ],
    },
    labels: {
        singular: "Project",
        plural: "Projects",
    },
    admin: {
        useAsTitle: "title",
        // defaultColumns: ["title", "status", "featured", "order"],
        defaultColumns: [
            "title",
            "projectStatus",
            "_status",
            "visibility",
            "year",
            "createdAt",
        ],
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
            name: "visibility",
            label: "Visibility",
            type: "radio",
            defaultValue: "show",
            options: [
                { label: "Show", value: "show" },
                { label: "Hidden", value: "hidden" },
            ],
            admin: {
                position: "sidebar",
                description:
                    "Définit si le projet est visible ou non sur le site.",
            },
        },

        {
            name: "coverImage",
            label: "Cover image",
            type: "upload",
            relationTo: "media",
            required: true,
            filterOptions: {
                mediaType: {
                    equals: "image",
                },
            },
        },
        {
            name: "galleryMedia",
            label: "Gallerie images et vidéos",
            type: "array",
            fields: [
                {
                    name: "media",
                    label: "Media",
                    type: "upload",
                    relationTo: "media",
                    filterOptions: {
                        mediaType: {
                            in: ["image", "video"],
                        },
                    },
                },
                {
                    name: "layout",
                    type: "select",
                    defaultValue: "auto",
                    options: [
                        {
                            label: "Auto",
                            value: "auto",
                        },
                        {
                            label: "Portrait",
                            value: "portrait",
                        },
                        {
                            label: "Landscape",
                            value: "landscape",
                        },
                        {
                            label: "Square",
                            value: "square",
                        },
                        {
                            label: "Full width",
                            value: "full",
                        },
                    ],
                    admin: {
                        description:
                            "Auto - détection automatique du format | Portrait - media verticale | Landscape - media horizontale | Square - media carrée | Full width - media pleine largeur",
                    },
                },
            ],
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
            name: "projectStatus",
            label: "Project status",
            type: "radio",
            options: [
                { label: "Completed", value: "délivré" },
                { label: "In progress", value: "en cours" },
                { label: "Concept", value: "concept" },
            ],
        },
        {
            name: "seoTitle",
            label: "Legacy SEO title",
            type: "text",
            admin: {
                hidden: true,
            },
        },
        {
            name: "seoDescription",
            label: "Legacy SEO description",
            type: "textarea",
            admin: {
                hidden: true,
            },
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
                },
                {
                    name: "layout",
                    type: "select",
                    defaultValue: "auto",
                    options: [
                        {
                            label: "Auto",
                            value: "auto",
                        },
                        {
                            label: "Portrait",
                            value: "portrait",
                        },
                        {
                            label: "Landscape",
                            value: "landscape",
                        },
                        {
                            label: "Square",
                            value: "square",
                        },
                        {
                            label: "Full width",
                            value: "full",
                        },
                    ],
                    admin: {
                        description:
                            "Auto - détection automatique du format | Portrait - media verticale | Landscape - media horizontale | Square - media carrée | Full width - media pleine largeur",
                    },
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
