import {
    authenticatedOrPublished,
    canUpdateProject,
    isAdminField,
} from "@/access";
import { createSeoFields } from "@/fields/seo";
import { revalidateProject, revalidateProjectDelete } from "@/hooks/revalidate";
import { createSlugField } from "@/fields/slug";
import type { CollectionConfig } from "payload";

export const Projects: CollectionConfig = {
    slug: "projects",
    access: { read: authenticatedOrPublished, update: canUpdateProject },
    versions: {
        drafts: true,
    },
    // Shared media are immutable in this worktree: do not run assignProjectToMedia here.
    // The original association helper remains available for the normal environment.
    hooks: {
        afterChange: [revalidateProject],
        afterDelete: [revalidateProjectDelete],
    },
    labels: {
        singular: "Projet",
        plural: "Projets",
    },
    admin: {
        group: "Projets",
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
            label: "Mise en page",
            type: "select",
            required: true,
            defaultValue: "default",
            options: [
                { label: "Classique", value: "default" },
                { label: "Éditoriale", value: "editorial" },
                { label: "Galerie", value: "galleryFocused" },
                { label: "Minimale", value: "minimal" },
            ],
            admin: {
                description:
                    "Classique : page projet standard. Éditoriale : textes et images alternés. Galerie : images dominantes, peu de texte. Minimale : titre et quelques images.",
            },
        },
        {
            name: "title",
            label: "Titre",
            type: "text",
            required: true,
        },
        createSlugField({
            access: { update: isAdminField },
            admin: {
                position: "sidebar",
                description:
                    "Ce champ définit l’URL publique du projet (slug). Il est généré automatiquement à partir du titre lors de la sauvegarde. Ne le modifiez que si vous avez un besoin spécifique. Utilisez uniquement des lettres minuscules, chiffres et tirets. Évitez les espaces, accents, caractères spéciaux et modifications fréquentes afin de ne pas casser les liens existants. Seul un administrateur peut modifier ce champ.",
            },
        }),
        {
            name: "visibility",
            label: "Visibilité",
            type: "radio",
            defaultValue: "show",
            options: [
                { label: "Visible", value: "show" },
                { label: "Masqué", value: "hidden" },
            ],
            admin: {
                position: "sidebar",
                description:
                    "Définit si le projet est visible ou non sur le site.",
            },
        },

        {
            name: "coverImage",
            label: "Image de couverture",
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
            label: "Galerie d’images et de vidéos",
            type: "array",
            labels: { singular: "Média", plural: "Médias" },
            fields: [
                {
                    name: "media",
                    label: "Média",
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
                    label: "Format",
                    type: "select",
                    defaultValue: "auto",
                    options: [
                        {
                            label: "Automatique",
                            value: "auto",
                        },
                        {
                            label: "Vertical",
                            value: "portrait",
                        },
                        {
                            label: "Horizontal",
                            value: "landscape",
                        },
                        {
                            label: "Carré",
                            value: "square",
                        },
                        {
                            label: "Pleine largeur",
                            value: "full",
                        },
                    ],
                    admin: {
                        description:
                            "Automatique : le format est détecté. Choisir un autre format seulement pour forcer l’affichage.",
                    },
                },
            ],
        },
        {
            name: "shortDescription",
            label: "Description courte",
            type: "textarea",
            required: true,
            maxLength: 300,
        },
        {
            name: "longDescription",
            label: "Description détaillée",
            type: "richText",
        },
        {
            name: "location",
            label: "Lieu",
            type: "text",
        },
        {
            name: "year",
            label: "Année",
            type: "number",
            // Evaluated when a project is created, not when the server starts.
            defaultValue: () => new Date().getFullYear(),
        },
        {
            name: "categories",
            label: "Catégories",
            type: "relationship",
            relationTo: "categories",
            hasMany: true,
            admin: { hidden: true },
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
            label: "Statut du projet",
            type: "radio",
            defaultValue: "délivré",
            options: [
                { label: "Livré", value: "délivré" },
                { label: "En cours", value: "en cours" },
                { label: "Concept", value: "concept" },
            ],
        },
        {
            name: "plans",
            label: "Plans / Dessins",
            type: "array",
            labels: { singular: "Plan", plural: "Plans" },
            maxRows: 3,
            admin: {
                description:
                    "Ajouter jusqu’à 3 plans (ex : plan masse, plan RDC, plan étage) qui seront affichés dans une section dédiée du projet.",
            },
            fields: [
                {
                    name: "image",
                    label: "Image",
                    type: "upload",
                    relationTo: "media",
                    filterOptions: {
                        mediaType: {
                            equals: "image",
                        },
                    },
                },
                {
                    name: "layout",
                    label: "Format",
                    type: "select",
                    defaultValue: "auto",
                    options: [
                        {
                            label: "Automatique",
                            value: "auto",
                        },
                        {
                            label: "Vertical",
                            value: "portrait",
                        },
                        {
                            label: "Horizontal",
                            value: "landscape",
                        },
                        {
                            label: "Carré",
                            value: "square",
                        },
                        {
                            label: "Pleine largeur",
                            value: "full",
                        },
                    ],
                    admin: {
                        description:
                            "Automatique : le format est détecté. Choisir un autre format seulement pour forcer l’affichage.",
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
        ...createSeoFields(true),
    ],
};
