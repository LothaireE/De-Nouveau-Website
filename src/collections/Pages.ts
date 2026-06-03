import { revalidateFrontend } from "@/library/payload/hooks";
import type { CollectionConfig } from "payload";

export const Pages: CollectionConfig = {
    slug: "pages",
    labels: {
        singular: "Page",
        plural: "Pages",
    },
    admin: {
        useAsTitle: "title",
        defaultColumns: ["pageType", "slug", "title", "createdAt", "updatedAt"],
    },
    hooks: {
        afterChange: [
            async ({ doc }) => {
                if (doc.slug === "home") {
                    await revalidateFrontend("/");
                    return;
                }
                await revalidateFrontend(`/${doc.slug}`);
            },
        ],
    },
    fields: [
        {
            name: "pageType",
            label: "Type de page",
            type: "select",
            required: true,
            unique: true,
            options: [
                { label: "Homepage", value: "homepage" },
                { label: "About", value: "about" },
                { label: "Contact", value: "contact" },
            ],
            // hooks:{
            //     afterChange:[({ data, previousData, req }) => {
            //         if(previousData?.pageType === data.pageType) return; // only run when pageType is changed]
            //     }]
            // }
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
                        if (siblingData?.pageType === "contact")
                            return "contact";
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
                condition: (_, siblingData) =>
                    siblingData?.pageType !== "homepage",
            },
        },
        {
            name: "heroMedia",
            label: "Média hero",
            type: "upload",
            relationTo: "media",
            filterOptions: {
                or: [
                    { mediaType: { equals: "image" } },
                    { mediaType: { equals: "video" } },
                ],
            },
            admin: {
                condition: (_, siblingData) =>
                    siblingData?.pageType === "homepage",
                description:
                    "Image ou vidéo hero. MP4/WebM recommandé pour les vidéos. Max 4MB pour les vidéos.",
            },
        },
        {
            name: "email",
            label: "Email",
            type: "email",
        },
        {
            name: "phone",
            label: "Téléphone",
            type: "text",
        },
        {
            name: "address",
            label: "Adresse",
            type: "textarea",
        },
        {
            name: "socialMedias",
            label: "Social medias",
            type: "array",
            admin: {
                condition: (_, siblingData) =>
                    siblingData?.pageType !== "homepage",
            },
            fields: [
                {
                    name: "link",
                    label: "Link",
                    type: "text",
                    admin: {
                        description:
                            "Provide a full url (ex: https://www.instagram.com/).",
                    },
                },
                {
                    name: "label",
                    label: "Label",
                    type: "text",
                    admin: {
                        description:
                            "Label used as a placeholder for the link.",
                    },
                },
            ],
        },
        {
            name: "awards",
            label: "Prix / distinctions",
            type: "array",
            admin: {
                description: "Available on about page",
                condition: (_, siblingData) =>
                    siblingData?.pageType === "about",
            },
            fields: [
                {
                    name: "name",
                    label: "nom",
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
            label: "Equipe",
            type: "array",
            admin: {
                description: "Available on about page",
                condition: (_, siblingData) =>
                    siblingData?.pageType === "about",
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
    ],
};
