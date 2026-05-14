import type { CollectionConfig } from "payload";
import slugify from "slugify";

export const Projects: CollectionConfig = {
    slug: "projects",
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
            required: true,
            unique: true,
            hooks: {
                beforeValidate: [
                    ({ value, data }) => {
                        if (typeof value === "string" && value.length > 0) {
                            return value;
                        }

                        if (data?.title && typeof data.title === "string") {
                            return slugify(data.title, {
                                lower: true,
                                strict: true,
                            });
                        }

                        return value;
                    },
                ],
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
                    required: true,
                },
                {
                    name: "caption",
                    type: "text",
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
            name: "featured",
            label: "Featured project",
            type: "checkbox",
            defaultValue: false,
        },
        {
            name: "order",
            label: "Order",
            type: "number",
            defaultValue: 0,
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
            name: "language",
            label: "Language",
            type: "select",
            defaultValue: "fr",
            options: [
                { label: "French", value: "fr" },
                { label: "English", value: "en" },
            ],
        },
        {
            name: "translations",
            label: "Translations",
            type: "relationship",
            relationTo: "projects",
            hasMany: true,
        },
        {
            name: "plans",
            label: "Plans",
            type: "array",
            fields: [
                {
                    name: "image",
                    label: "Image",
                    type: "upload",
                    relationTo: "media",
                    required: true,
                },
                {
                    name: "caption",
                    label: "Caption",
                    type: "text",
                },
            ],
        },
        {
            name: "planDetails",
            label: "Détail des plans",
            type: "richText",
            admin: {
                description:
                    "Description des plans du projet : listes, paragraphes, etc.",
            },
        },
    ],
};
