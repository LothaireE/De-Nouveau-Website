import type { Field } from "payload";
import { HERO_VIDEO_MAX_BYTES, validateHeroMedia } from "./heroMedia";

export const createPageFields = (): Field[] => [
    {
        name: "pageType",
        label: "Type de page",
        type: "select",
        required: true,
        unique: true,
        options: [
            { label: "Accueil", value: "homepage" },
            { label: "À propos", value: "about" },
            { label: "Contact", value: "contact" },
        ],
    },
    {
        name: "title",
        label: "Titre",
        type: "text",
        required: true,
    },
    {
        name: "slug",
        type: "text",
        required: true,
        unique: true,
        admin: {
            condition: () => false,
        },
        hooks: {
            beforeValidate: [
                ({ siblingData }) => {
                    if (siblingData?.pageType === "homepage") return "home";
                    if (siblingData?.pageType === "about") return "about";
                    if (siblingData?.pageType === "contact") return "contact";
                    return "";
                },
            ],
        },
    },
    {
        name: "intro",
        label: "Texte d’introduction",
        type: "textarea",
    },
    {
        name: "content",
        label: "Contenu texte",
        type: "richText",
        admin: {
            description:
                "Sauter deux lignes pour créer un espace entre les paragraphes.",
        },
    },
    {
        name: "portrait",
        label: "Image",
        type: "upload",
        relationTo: "media",
        filterOptions: {
            mediaType: { equals: "image" },
        },
        admin: {
            condition: (_, siblingData) => siblingData?.pageType !== "homepage",
        },
    },
    {
        name: "heroMedia",
        label: "Média d’en-tête",
        type: "upload",
        relationTo: "media",
        filterOptions: {
            or: [
                { mediaType: { equals: "image" } },
                {
                    and: [
                        { mediaType: { equals: "video" } },
                        { filesize: { less_than_equal: HERO_VIDEO_MAX_BYTES } },
                    ],
                },
            ],
        },
        validate: validateHeroMedia,
        admin: {
            condition: (_, siblingData) => siblingData?.pageType === "homepage",
            description:
                "Image ou vidéo en haut de la page d’accueil. Vidéo : MP4 ou WebM, 4 Mo maximum. Les vidéos plus lourdes ne sont pas proposées.",
        },
    },
    {
        admin: { hidden: true },
        name: "email",
        label: "E-mail",
        type: "email",
    },
    {
        admin: { hidden: true },
        name: "phone",
        label: "Téléphone",
        type: "text",
    },
    {
        admin: { hidden: true },
        name: "address",
        label: "Adresse",
        type: "textarea",
    },
    {
        name: "socialMedias",
        label: "Réseaux sociaux",
        type: "array",
        labels: { singular: "Réseau social", plural: "Réseaux sociaux" },
        admin: {
            hidden: true,
        },
        fields: [
            {
                name: "link",
                label: "Lien",
                type: "text",
                admin: {
                    description:
                        "Adresse complète (ex. : https://www.instagram.com/…).",
                },
            },
            {
                name: "label",
                label: "Nom affiché",
                type: "text",
                admin: {
                    description:
                        "Texte affiché à la place du lien (ex. : Instagram).",
                },
            },
        ],
    },
    {
        name: "awards",
        label: "Prix / distinctions",
        type: "array",
        labels: { singular: "Distinction", plural: "Distinctions" },
        admin: {
            condition: (_, siblingData) => siblingData?.pageType === "about",
        },
        fields: [
            {
                name: "name",
                label: "Nom",
                type: "text",
            },
            {
                name: "year",
                label: "Année",
                type: "text",
            },
        ],
    },
    {
        name: "studioTeam",
        label: "Équipe",
        type: "array",
        labels: { singular: "Membre", plural: "Membres" },
        admin: {
            condition: (_, siblingData) => siblingData?.pageType === "about",
        },
        fields: [
            {
                name: "name", // fullname
                label: "Prénom Nom",
                type: "text",
            },
            {
                name: "role",
                label: "Rôle",
                type: "text",
            },
        ],
    },
];
