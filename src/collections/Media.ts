import { protectSharedMedia } from "@/hooks/readOnlyMedia";
import { isMediaReadOnly } from "@/lib/payload/isolation";
import { revalidateRelated, revalidateRelatedDelete } from "@/hooks/revalidate";
import {
    assignMediatype,
    preventDuplicateFilename,
} from "@/library/payload/hooks";
import { suggestMediaTextEndpoint } from "@/lib/ai/suggestEndpoint";
import type { CollectionConfig } from "payload";

const SuggestField =
    "@/components/admin/MediaTextSuggestField#MediaTextSuggestField";

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

const readOnly = isMediaReadOnly();

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
    // Shared storage: writes are blocked where media must stay read-only.
    ...(readOnly
        ? {
              access: {
                  create: () => false,
                  update: () => false,
                  delete: () => false,
              },
          }
        : {}),
    // Read-only: works even where media writes are blocked.
    endpoints: [suggestMediaTextEndpoint],
    hooks: {
        afterChange: [revalidateRelated],
        afterDelete: [revalidateRelatedDelete],
        beforeOperation: [
            ...(readOnly ? [protectSharedMedia] : []),
            preventDuplicateFilename,
        ],
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
        // Caption first: the alt suggestion reuses it and must not repeat it.
        {
            name: "caption",
            label: "Légende",
            type: "text",
            admin: {
                description:
                    "Affichée sur le site : donne le contexte en quelques mots (60 caractères max). « Suggestion » propose une légende à relire et corriger avant d'enregistrer.",
                components: { Field: SuggestField },
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
                    "Important pour l'accessibilité et le référencement. Décrit ce qu'on voit, sans répéter la légende (125 caractères max). « Suggestion » propose un texte à relire et corriger avant d'enregistrer.",
                components: { Field: SuggestField },
            },
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
