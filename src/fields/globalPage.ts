import type { Field } from "payload";
import { createPageFields } from "./page";
import { createSeoFields } from "./seo";
export function createGlobalPageFields(
    pageType: "homepage" | "about" | "contact",
    // Page-specific fields, placed before the SEO section that ends every form.
    extraFields: Field[] = [],
): Field[] {
    return [
        ...createPageFields()
            .filter(
                (field) =>
                    !("name" in field) ||
                    !["pageType", "slug"].includes(field.name),
            )
            .map((field) => {
                // Keep every content field so the copy is lossless; adapt only admin visibility.
                const condition = field.admin?.condition;
                return condition
                    ? ({
                          ...field,
                          admin: {
                              ...field.admin,
                              condition: (data, siblingData, context) =>
                                  condition(
                                      data,
                                      { ...siblingData, pageType },
                                      context,
                                  ),
                          },
                      } as Field)
                    : field;
            }),
        ...extraFields,
        ...createSeoFields(false, pageType === "homepage" ? "home" : pageType),
    ];
}
