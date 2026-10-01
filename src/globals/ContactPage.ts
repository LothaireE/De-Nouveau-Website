import type { GlobalConfig } from "payload";
import { isAuthenticated } from "@/access";
import { createGlobalPageFields } from "@/fields/globalPage";
import { revalidateGlobal } from "@/hooks/revalidate";
export const ContactPage: GlobalConfig = {
    slug: "contact-page",
    label: "Contact",
    admin: { group: "Pages du site" },
    access: { read: () => true, update: isAuthenticated },
    hooks: { afterChange: [revalidateGlobal("/")] },
    fields: createGlobalPageFields("contact"),
};
