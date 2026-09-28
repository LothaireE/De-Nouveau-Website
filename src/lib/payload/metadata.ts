import { createMetadata } from "@/library/seo";
import { getStaticPageSeo, type StaticSeoPage } from "@/library/seoContent";
import { getPage } from "./fetchers";
export async function getPageMetadata(slug: StaticSeoPage) {
    const page = await getPage(slug);
    return createMetadata({ ...getStaticPageSeo(slug, page), locale: "fr_FR" });
}
