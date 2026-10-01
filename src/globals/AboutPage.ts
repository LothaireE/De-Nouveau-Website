import type { GlobalConfig } from "payload";
import { isAuthenticated } from "@/access";
import { createGlobalPageFields } from "@/fields/globalPage";
import { revalidateGlobal } from "@/hooks/revalidate";
export const AboutPage: GlobalConfig = {
    slug: "about-page",
    label: "À propos",
    admin: { group: "Pages du site" },
    access: { read: () => true, update: isAuthenticated },
    hooks: { afterChange: [revalidateGlobal("/about")] },
    fields: createGlobalPageFields("about"),
};
