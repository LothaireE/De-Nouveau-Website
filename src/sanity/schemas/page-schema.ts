import { defineField, defineType } from "sanity";

export const page = defineType({
    name: "page",
    title: "Pages",
    type: "document",
    fields: [
        defineField({
            name: "pageType",
            title: "Type de page",
            type: "string",
            options: {
                list: [
                    { title: "Homepage", value: "homepage" },
                    { title: "About", value: "about" },
                    { title: "Contact", value: "contact" },
                ],
                layout: "radio",
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "title",
            title: "Titre",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            options: { source: "pageType" },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "intro",
            title: "Texte d’introduction",
            type: "text",
            rows: 4,
        }),
        defineField({
            name: "content",
            title: "Contenu texte",
            type: "array",
            of: [{ type: "block" }],
        }),
        defineField({
            name: "portrait",
            title: "Image / Portrait",
            type: "image",
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: "heroImage",
            title: "Image hero",
            type: "image",
            options: {
                hotspot: true,
            },
            description: "ne sera utilisé que pour home ?",
            hidden: ({ document }) => document?.pageType !== "homepage",
        }),
        defineField({
            name: "heroVideoUrl",
            title: "Vidéo hero optionnelle",
            type: "url",
        }),
        defineField({
            name: "email",
            title: "Email",
            type: "string",
        }),
        defineField({
            name: "phone",
            title: "Téléphone",
            type: "string",
        }),
        defineField({
            name: "address",
            title: "Adresse",
            type: "text",
            rows: 3,
        }),
    ],
    preview: {
        select: {
            title: "pageType",
            subtitle: "title",
        },
        prepare({ title, subtitle }) {
            return {
                title:
                    title === "homepage"
                        ? "Homepage"
                        : title === "about"
                          ? "About"
                          : title === "contact"
                            ? "Contact"
                            : "Page",
                subtitle,
            };
        },
    },
});

export default page;
