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
        useAsTitle: "title",
        defaultColumns: ["pageType", "slug", "title", "createdAt", "updatedAt"],
    },
    hooks: {
        afterChange: [revalidatePage],
        afterDelete: [revalidatePageDelete],
    },
    fields: createPageFields(),
};
