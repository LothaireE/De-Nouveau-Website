import type { CollectionConfig } from "payload";
import slugify from "slugify";

export const Categories: CollectionConfig = {
    slug: "categories",
    labels: {
        singular: "Category",
        plural: "Categories",
    },
    admin: {
        useAsTitle: "title",
        defaultColumns: ["title", "slug"],
    },
    fields: [
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
    ],
};
