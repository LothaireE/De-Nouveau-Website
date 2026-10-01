import { featuredProjectsField } from "@/fields/featuredProjects";
import type { GlobalConfig } from "payload";
import { isAuthenticated } from "@/access";
import { createGlobalPageFields } from "@/fields/globalPage";
import { revalidateGlobal } from "@/hooks/revalidate";
export const HomePage: GlobalConfig = {
    slug: "home-page",
    label: "Accueil",
    admin: { group: "Pages du site" },
    access: { read: () => true, update: isAuthenticated },
    hooks: { afterChange: [revalidateGlobal("/")] },
    fields: createGlobalPageFields("homepage", [featuredProjectsField]),
};
