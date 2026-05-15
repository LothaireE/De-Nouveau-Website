import type { FieldHook } from "payload";
import slugify from "slugify";

export const formatSlug =
    (fallback: string): FieldHook =>
    ({ data, originalDoc, value }) => {
        if (typeof value === "string" && value.length > 0) {
            return slugify(value, {
                lower: true,
                strict: true,
            });
        }

        const fallbackData = data?.[fallback] || originalDoc?.[fallback];

        if (fallbackData && typeof fallbackData === "string") {
            return slugify(fallbackData, {
                lower: true,
                strict: true,
            });
        }

        return value;
    };
