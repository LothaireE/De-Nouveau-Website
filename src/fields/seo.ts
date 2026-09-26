import type { Field } from "payload";
export const createSeoFields = (legacy = false): Field[] => [
    {
        name: "seoTitle",
        label: legacy ? "Legacy SEO title" : "Titre SEO",
        type: "text",
        admin: { hidden: legacy },
    },
    {
        name: "seoDescription",
        label: legacy ? "Legacy SEO description" : "Description SEO",
        type: "textarea",
        admin: { hidden: legacy },
    },
];
