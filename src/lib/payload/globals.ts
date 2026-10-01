import { getAgencyInfo } from "./agency";
import { cache } from "react";
import type { Page, HomePage } from "@/payload-types";
import { getPayloadClient } from "./payload";
export const globalPages = {
    home: { global: "home-page", pageType: "homepage" },
    about: { global: "about-page", pageType: "about" },
    contact: { global: "contact-page", pageType: "contact" },
} as const;
export type SitePage = Page & {
    featuredProjects?: HomePage["featuredProjects"];
    seoTitle?: string | null;
    seoDescription?: string | null;
};
export const getPage = cache(async (slug: string): Promise<SitePage | null> => {
    const payload = await getPayloadClient();
    const mapping = globalPages[slug as keyof typeof globalPages];
    if (mapping) {
        const doc = await payload.findGlobal({
            slug: mapping.global,
            depth: 2,
        });
        // An auto-created empty row is not editorial content. Never merge fields:
        // an editor can deliberately clear an optional field in a populated Global.
        if (doc.title?.trim())
            return {
                ...doc,
                ...(await getAgencyInfo()),
                title: doc.title,
                slug,
                pageType: mapping.pageType,
            } as SitePage;
    }
    const result = await payload.find({
        collection: "pages",
        depth: 2,
        where: { slug: { equals: slug } },
        limit: 1,
    });
    return result.docs[0]
        ? { ...result.docs[0], ...(await getAgencyInfo()) }
        : null;
});
export const getHomePage = () => getPage("home");
export const getAboutPage = () => getPage("about");
export const getContactPage = () => getPage("contact");
