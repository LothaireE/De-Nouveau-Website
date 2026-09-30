import type { Field } from "payload";
import { isAdminField } from "@/access";
import type { SeoPreviewKind } from "@/library/seoContent";

export const createSeoFields = (
    legacy = false,
    kind: SeoPreviewKind = "project",
): Field[] => {
    const fields: Field[] = [
        {
            name: "seoTitle",
            label: legacy
                ? "Ancien titre SEO"
                : "Titre personnalisé (facultatif)",
            type: "text",
            access: { create: isAdminField, update: isAdminField },
            admin: {
                hidden: legacy,
                description: "Laisser vide pour utiliser le titre automatique.",
            },
        },
        {
            name: "seoDescription",
            label: legacy
                ? "Ancienne description SEO"
                : "Description personnalisée (facultative)",
            type: "textarea",
            access: { create: isAdminField, update: isAdminField },
            admin: {
                hidden: legacy,
                description:
                    "Laisser vide pour utiliser la description automatique.",
            },
        },
    ];
    const preview: Field = {
        name: "seoPreview",
        type: "ui",
        admin: {
            components: {
                Field: {
                    path: "@/components/admin/SeoPreview#SeoPreview",
                    clientProps: { kind },
                },
            },
        },
    };
    return legacy
        ? [preview, ...fields]
        : [
              preview,
              {
                  type: "collapsible",
                  label: "Réglages SEO avancés",
                  admin: {
                      initCollapsed: true,
                      condition: (_data, _siblingData, { user }) =>
                          user?.role === "admin",
                  },
                  fields,
              },
          ];
};
