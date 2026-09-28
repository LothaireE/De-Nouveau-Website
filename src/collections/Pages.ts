import { createPageFields } from "@/fields/page";
import { revalidatePage, revalidatePageDelete } from "@/hooks/revalidate";
import type { CollectionConfig } from "payload";

export const Pages: CollectionConfig = {
    slug: "pages",
    labels: {
        singular: "Page",
        plural: "Pages",
    },
    admin: {
        hidden: true, // Retained for legacy fallback; edit the page Globals instead.
        useAsTitle: "title",
        defaultColumns: ["pageType", "slug", "title", "createdAt", "updatedAt"],
    },
    hooks: {
        afterChange: [revalidatePage],
        afterDelete: [revalidatePageDelete],
    },
    fields: createPageFields(),
};
