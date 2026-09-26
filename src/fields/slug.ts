import type { TextField } from "payload";
import { formatSlug } from "@/library/payload/hooks";
export const createSlugField = (
    overrides: Pick<TextField, "admin" | "access"> = {},
): TextField => ({
    name: "slug",
    label: "Slug",
    type: "text",
    required: true,
    unique: true,
    hooks: { beforeValidate: [formatSlug("title")] },
    ...overrides,
});
