import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
    slug: "media",
    admin: {
        useAsTitle: "alt",
        defaultColumns: [
            "filename",
            "project",
            "caption",
            "createdAt",
            "updatedAt",
        ],
    },
    upload: {
        // formatOptions: { // maybe later if I want to impose webp, I can use formatOptions
        //     format: 'webp',
        //     options: {
        //     quality: 80,
        //     },
        // },

        mimeTypes: ["image/*", "video/*"],
        imageSizes: [
            {
                name: "thumbnail",
                width: 600,
                height: 400,
                position: "centre",
                // formatOptions: { // I can use formatOptions on one specific image also
                //     format: 'webp',
                // },
            },
            {
                name: "card",
                width: 1200,
                height: 800,
                position: "centre",
            },
            {
                name: "hero",
                width: 2400,
                height: 1600,
                position: "centre",
            },
            {
                name: "large",
                width: 3000,
                position: "centre",
            },
        ],
    },
    fields: [
        {
            name: "project",
            label: "Projet associé",
            type: "relationship",
            relationTo: "projects",
            admin: {
                position: "sidebar",
                description:
                    "Sauf indications contraires, il est recommandé d'ignorer ce champ car lorsque non renseigné, l'image sera automatiquement associée à un projet lors de la création ou de la mise à jour de celui ci (hero, galerie, plans).",
            },
        },
        // {
        //     name: "usage",
        //     type: "select",
        //     options: [
        //         // I will implement usage-based image selection, for now it's just metadata
        //         { label: "Hero", value: "hero" },
        //         { label: "Galerie", value: "gallery" },
        //         { label: "Plan / Dessins", value: "plan" },
        //         { label: "Portrait", value: "portrait" },
        //         { label: "Détail", value: "detail" },
        //         { label: "Divers", value: "misc" },
        //     ],
        //     defaultValue: "misc",
        // },
        {
            name: "alt",
            label: "Texte alternatif",
            type: "text",
            admin: {
                description:
                    "Il est recommandé de fournir un texte alternatif, important pour l'accessibilité et le référencement. Il doit décrire le contenu de l'image de manière concise et précise.",
            },
        },
        {
            name: "caption",
            label: "Légende",
            type: "text",
        },
    ],
};
