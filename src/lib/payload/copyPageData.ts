import type { Page } from "@/payload-types";
export const pageContentKeys = [
    "title",
    "intro",
    "content",
    "portrait",
    "heroMedia",
    "email",
    "phone",
    "address",
    "socialMedias",
    "awards",
    "studioTeam",
] as const;
export function copyPageData(page: Page) {
    return Object.fromEntries(
        pageContentKeys.map((key) => [key, page[key] ?? null]),
    );
}
export function hasGlobalContent(doc: Record<string, unknown>): boolean {
    return [...pageContentKeys, "seoTitle", "seoDescription"].some((key) => {
        const value = doc[key];
        if (typeof value === "string") return Boolean(value.trim());
        if (Array.isArray(value)) return value.length > 0;
        return value !== null && value !== undefined;
    });
}
