import { Category } from "@/types/Category";
import { defineField, defineType } from "sanity";

export const project = defineType({
    name: "project",
    title: "Project",
    type: "document",
    fields: [
        defineField({
            name: "projectLayout",
            title: "Project layout",
            type: "string",
            options: {
                list: [
                    { title: "Default", value: "default" },
                    { title: "Editorial", value: "editorial" },
                    { title: "Gallery focused", value: "galleryFocused" },
                    { title: "Minimal", value: "minimal" },
                ],
            },
            initialValue: "default",
            validation: (Rule) => Rule.required(),
            description:
                "Définit la mise en page du projet côté site : Default - page projet classique | Editorial - texte et images alternées | Gallery focused - galerie dominante, peu de texte | Minimal - titre et quelques images, très peu d’infos",
        }),

        defineField({
            name: "title",
            title: "Title",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            options: { source: "title", maxLength: 96 },
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: "coverImage",
            title: "Cover image",
            type: "image",
            options: { hotspot: true },
            fields: [
                {
                    name: "caption",
                    type: "string",
                    title: "Caption",
                },
                {
                    name: "alt",
                    type: "string",
                    title: "Alternative text",
                },
            ],
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: "galleryImages",
            title: "Gallery images",
            type: "array",
            of: [
                {
                    type: "image",
                    options: {
                        hotspot: true,
                    },
                    fields: [
                        {
                            name: "caption",
                            type: "string",
                            title: "Caption",
                        },
                        {
                            name: "alt",
                            type: "string",
                            title: "Alternative text",
                        },
                    ],
                },
            ],
        }),

        defineField({
            name: "video",
            title: "Video",
            type: "url",
        }),

        defineField({
            name: "shortDescription",
            title: "Short description",
            type: "text",
            rows: 3,
            validation: (Rule) => Rule.required().max(300),
        }),

        defineField({
            name: "longDescription",
            title: "Long description",
            type: "array",
            of: [{ type: "block" }],
        }),

        defineField({
            name: "location",
            title: "Location",
            type: "string",
        }),

        defineField({
            name: "year",
            title: "Year",
            type: "number",
        }),

        defineField({
            name: "categories",
            title: "Categories",
            type: "array",
            of: [
                {
                    type: "reference",
                    to: [{ type: "category" }],
                },
            ],
        }),

        defineField({
            name: "surface",
            title: "Surface",
            type: "string",
        }),

        defineField({
            name: "client",
            title: "Client",
            type: "string",
        }),

        defineField({
            name: "status",
            title: "Status",
            type: "string",
            options: {
                list: [
                    { title: "Completed", value: "completed" },
                    { title: "In progress", value: "inProgress" },
                    { title: "Concept", value: "concept" },
                ],
                layout: "radio",
            },
        }),

        defineField({
            name: "featured",
            title: "Featured project",
            type: "boolean",
            initialValue: false,
        }),

        defineField({
            name: "order",
            title: "Order",
            type: "number",
            initialValue: 0,
        }),

        defineField({
            name: "seoTitle",
            title: "SEO title",
            type: "string",
        }),

        defineField({
            name: "seoDescription",
            title: "SEO description",
            type: "text",
        }),

        defineField({
            name: "language",
            title: "Language",
            type: "string",
            options: {
                list: [
                    { title: "French", value: "fr" },
                    { title: "English", value: "en" },
                ],
            },
            initialValue: "fr",
        }),

        defineField({
            name: "translations",
            title: "Translations",
            type: "array",
            of: [{ type: "reference", to: [{ type: "project" }] }],
        }),

        defineField({
            name: "planImage",
            title: "Plans",
            type: "image",
            options: { hotspot: true },
            fields: [
                {
                    name: "caption",
                    type: "string",
                    title: "Caption",
                },
                {
                    name: "alt",
                    type: "string",
                    title: "Alternative text",
                },
            ],
        }),

        defineField({
            name: "planDetails",
            title: "Détail des plans",
            type: "array",
            of: [{ type: "block" }],
            description:
                "Déscription des plans du projets (liste, paragraphes, etc...)",
        }),
    ],

    preview: {
        select: {
            title: "title",
            media: "coverImage",
            categories: "categories",
        },
        prepare({ title, media, categories }) {
            const subtitle = categories
                ?.map((cat: Category) => cat?.title)
                .filter(Boolean)
                .join(", ");

            return {
                title,
                subtitle,
                media,
            };
        },
    },
});
