/** Shared by the public metadata and the read-only admin preview. */
export const staticPageSeo = {
    home: {
        title: "De Nouveau — Studio d’architecture et de design",
        description:
            "Découvrez De Nouveau, un studio d’architecture et de design qui réinterprète l’architecture vernaculaire à travers une approche contemporaine.",
        path: "/",
    },
    about: {
        title: "Le studio et son approche — De Nouveau",
        description:
            "Découvrez l’approche de De Nouveau : faire dialoguer héritage et création contemporaine à travers ses projets d’architecture et de design.",
        path: "/about",
    },
    contact: {
        title: "Contacter le studio — De Nouveau",
        description:
            "Contactez le studio De Nouveau pour échanger sur votre projet d’architecture ou de design. Retrouvez ses coordonnées et ses réseaux sociaux.",
        path: "/contact",
    },
    legal: {
        title: "Mentions légales — De Nouveau",
        description:
            "Mentions légales du site De Nouveau : éditeur, inscription à l’Ordre des architectes, assurance professionnelle et hébergement.",
        path: "/mentions-legales",
    },
} as const;
export type StaticSeoPage = keyof typeof staticPageSeo;
export type SeoPreviewKind = StaticSeoPage | "project";

export function normalizeSeoText(value: unknown): string {
    return typeof value === "string" ? value.replace(/\s+/gu, " ").trim() : "";
}

/** A display target, not a Google limit. Prefer whole sentences, then whole words. */
export function summarizeDescription(value: unknown): string {
    const text = normalizeSeoText(value);
    const target = 160;
    if (text.length <= target) return text;
    let complete = "";
    for (const { segment } of new Intl.Segmenter("fr", {
        granularity: "sentence",
    }).segment(text)) {
        const candidate = normalizeSeoText(complete + " " + segment);
        if (candidate.length > target) break;
        complete = candidate;
    }
    if (complete.length >= 60) return complete;
    const boundary = text.lastIndexOf(" ", target - 1);
    // Preserve a single long token rather than splitting a word or URL.
    return boundary > 0
        ? text.slice(0, boundary).replace(/[\s,;:—-]+$/u, "") + "…"
        : text;
}

export function getProjectSeo(project: {
    title?: unknown;
    shortDescription?: unknown;
}) {
    const name = normalizeSeoText(project.title);
    return {
        title: name
            ? `${name} — De Nouveau`
            : "Projet d’architecture — De Nouveau",
        description:
            summarizeDescription(project.shortDescription) ||
            (name
                ? `Découvrez ${name}, un projet du studio d’architecture et de design De Nouveau.`
                : staticPageSeo.home.description),
    };
}

export function getStaticPageSeo(
    page: StaticSeoPage,
    overrides?: { seoTitle?: unknown; seoDescription?: unknown } | null,
) {
    const defaults = staticPageSeo[page];
    return {
        ...defaults,
        title: normalizeSeoText(overrides?.seoTitle) || defaults.title,
        description:
            normalizeSeoText(overrides?.seoDescription) || defaults.description,
    };
}
