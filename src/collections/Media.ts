import { protectSharedMedia } from "@/hooks/readOnlyMedia";
import { revalidateRelated, revalidateRelatedDelete } from "@/hooks/revalidate";
import {
    assignMediatype,
    preventDuplicateFilename,
} from "@/library/payload/hooks";
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
    labels: {
        singular: "Média",
        plural: "Médias",
    },
    admin: {
        group: "Projets",
        // The file name is always filled, unlike the optional alt text and caption.
        useAsTitle: "filename",
        defaultColumns: [
            "filename",
            "caption",
            "mediaType",
            "project",
            "updatedAt",
        ],
    },
    access: { create: () => false, update: () => false, delete: () => false },
    hooks: {
        afterChange: [revalidateRelated],
        afterDelete: [revalidateRelatedDelete],
        beforeOperation: [protectSharedMedia, preventDuplicateFilename],
        beforeValidate: [assignMediatype],
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
                readOnly: true,
                description:
                    "Renseigné automatiquement lorsque le média est utilisé dans un projet (couverture, galerie, plans).",
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
            label: "Image d’attente de la vidéo",
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
