import type { Page, Project } from "@/payload-types";
import { SITE_URL } from "@/library/seo";
import { getMediaUrl } from "@/library/utils";

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

function getPublicSocialLinks(page: Page | null) {
    return (page?.socialMedias ?? []).flatMap((socialMedia) => {
        if (!socialMedia.link) return [];

        try {
            const url = new URL(socialMedia.link);
            return url.protocol === "https:" || url.protocol === "http:"
                ? [url.toString()]
                : [];
        } catch {
            return [];
        }
    });
}

export function createOrganizationStructuredData(contactPage: Page | null) {
    const sameAs = getPublicSocialLinks(contactPage);

    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: "De Nouveau",
        url: SITE_URL,
        logo: `${SITE_URL}/DE_NOUVEAU/SVG/DE_NOUVEAU_BLACK.svg`,
        description: "Studio d'architecture et de design De Nouveau",
        knowsAbout: ["Architecture", "Design architectural"],
        ...(contactPage?.email ? { email: contactPage.email } : {}),
        ...(contactPage?.phone ? { telephone: contactPage.phone } : {}),
        ...(contactPage?.address
            ? { address: contactPage.address.trim() }
            : {}),
        ...(sameAs.length > 0 ? { sameAs } : {}),
    };
}

export function createProjectStructuredData(project: Project) {
    const projectUrl = new URL(`/${project.slug}`, SITE_URL).toString();
    const coverImage =
        project.coverImage && typeof project.coverImage !== "number"
            ? project.coverImage
            : null;
    const imageFilename =
        coverImage?.sizes?.hero?.filename ?? coverImage?.filename ?? null;
    const image = getMediaUrl(imageFilename);
    const keywords = (project.categories ?? []).flatMap((category) =>
        typeof category === "number" ? [] : [category.title],
    );

    return {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "@id": `${projectUrl}#project`,
        name: project.title,
        description: project.shortDescription,
        url: projectUrl,
        mainEntityOfPage: projectUrl,
        creator: {
            "@id": ORGANIZATION_ID,
        },
        inLanguage: "fr-FR",
        genre: "Architecture",
        dateModified: project.updatedAt,
        ...(image ? { image } : {}),
        ...(project.location
            ? {
                  contentLocation: {
                      "@type": "Place",
                      name: project.location,
                  },
              }
            : {}),
        ...(project.year ? { temporalCoverage: String(project.year) } : {}),
        ...(project.projectStatus
            ? { creativeWorkStatus: project.projectStatus }
            : {}),
        ...(keywords.length > 0 ? { keywords } : {}),
    };
}
