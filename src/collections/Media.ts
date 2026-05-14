import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
    slug: "media",
    upload: {
        mimeTypes: ["image/*", "video/*"],
        imageSizes: [
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
        ],
    },
    fields: [
        {
            name: "alt",
            label: "Alternative text",
            type: "text",
            required: true,
        },
        {
            name: "caption",
            label: "Caption",
            type: "text",
        },
    ],
};
