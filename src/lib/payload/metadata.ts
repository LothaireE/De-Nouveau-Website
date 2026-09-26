import { createMetadata } from "@/library/seo";
import { getPage } from "./fetchers";
export async function getPageMetadata(
    slug: string,
    defaults: Parameters<typeof createMetadata>[0],
) {
    const page = await getPage(slug);
    return createMetadata({
        ...defaults,
        title: page?.seoTitle?.trim() || defaults.title,
        description: page?.seoDescription?.trim() || defaults.description,
    });
}
