import type { CollectionConfig } from "payload";

const mimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
    "video/mp4",
    "video/webm",
];

const imageSizes = [
    {
        name: "thumbnail",
        width: 600,
        height: 400,
        position: "centre",
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
];

export const Media: CollectionConfig = {
    slug: "media",
    admin: {
        useAsTitle: "alt", // Caption would be better but waiting for client approval for mandatory Caption
        defaultColumns: [
            "filename",
            "mediaType",
            "project",
            "caption",
            "createdAt",
            "updatedAt",
        ],
    },
    hooks: {
        beforeValidate: [
            ({ data = {}, req }) => {
                const mimeType = req.file?.mimetype || data?.mimeType;

                if (!mimeType) return data;

                if (mimeType.startsWith("image/")) {
                    data.mediaType = "image";
                }

                if (mimeType.startsWith("video/")) {
                    data.mediaType = "video";
                    const maxSize = 4 * 1024 * 1024; // 4MB

                    if (req.file?.size && req.file.size > maxSize) {
                        throw new Error("la vidéo ne doit pas depasser 4MB.");
                    }
                }

                return data;
            },
        ],
    },
    upload: {
        mimeTypes: mimeTypes,
        imageSizes: imageSizes,
    },
    fields: [
        {
            name: "mediaType",
            label: "Type de média",
            type: "select",
            options: [
                { label: "Image", value: "image" },
                { label: "Vidéo", value: "video" },
            ],
            admin: {
                position: "sidebar",
                readOnly: true,
            },
        },
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
        {
            name: "alt",
            label: "Texte alternatif",
            type: "text",
            admin: {
                condition: (_, siblingData) =>
                    siblingData.mediaType !== "video",
                description:
                    "Important pour l'accessibilité et le référencement. Doit décrire le contenu de l'image de manière concise et précise.",
            },
        },
        {
            name: "caption",
            label: "Légende",
            type: "text",
        },
        {
            name: "poster",
            label: "Video poster",
            type: "upload",
            relationTo: "media",
            filterOptions: {
                mediaType: {
                    equals: "image",
                },
            },
            admin: {
                condition: (_, siblingData) =>
                    siblingData?.mediaType === "video",
                description:
                    "Image affichée pendant le chargement de la vidéo ou si la vidéo ne se charge pas.",
            },
        },
    ],
};
