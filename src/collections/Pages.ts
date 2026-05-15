import type { CollectionConfig } from "payload";

export const Pages: CollectionConfig = {
    slug: "pages",
    labels: {
        singular: "Page",
        plural: "Pages",
    },
    admin: {
        useAsTitle: "title",
        defaultColumns: ["pageType", "title", "slug"],
    },
    fields: [
        {
            name: "pageType",
            label: "Type de page",
            type: "select",
            required: true,
            options: [
                { label: "Homepage", value: "homepage" },
                { label: "About", value: "about" },
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
            label: "Slug",
            type: "text",
            required: true,
            unique: true,
            admin: {
                description: "Exemple : homepage, about, contact",
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
        },
        {
            name: "portrait",
            label: "Image / Portrait",
            type: "upload",
            relationTo: "media",
        },
        {
            name: "heroImage",
            label: "Image hero",
            type: "upload",
            relationTo: "media",
            admin: {
                description: "Ne sera utilisé que pour la homepage",
                condition: (_, siblingData) =>
                    siblingData?.pageType === "homepage",
            },
        },
        {
            name: "heroVideoUrl",
            label: "Vidéo hero optionnelle",
            type: "text",
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
    ],
};
