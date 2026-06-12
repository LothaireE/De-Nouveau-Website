import type { Metadata } from "next";

const siteUrl = "https://www.denouveau.fr";

type SeoParams = {
    title: string;
    description: string;
    path: string;
    locale: "fr_FR" | "en_US";
    image?: string;
};

export function createMetadata({
    title,
    description,
    path,
    locale,
    image = "/DE_NOUVEAU/PNG/og-default-de-nouveau.png", // Open Graph image for thumbnails
}: SeoParams): Metadata {
    // only a French version of the site, so hardcoded if we add English content, we should uncomment to determine the language based on the locale
    // const isFrench = locale === "fr_FR";
    const url = `${siteUrl}${path}`;
    const imageUrl = image.startsWith("http") ? image : `${siteUrl}${image}`;

    return {
        title,
        description,
        icons: {
            icon: "/icon.png",
            shortcut: "/icon.png",
            apple: "/icon.png",
        },
        metadataBase: new URL(siteUrl),
        alternates: {
            canonical: url,
            languages: {
                "fr-FR": url,
                // "fr-FR": `${siteUrl}${isFrench ? path : path.replace("/en", "")}`,
                // "en-US": `${siteUrl}${isFrench ? `/en${path}` : path}`, --- IGNORE FOR NOW ---
            },
        },
        keywords: [
            "architecture",
            "studio d’architecture",
            "architecte",
            "design",
            "projets architecturaux",
            "De Nouveau",
        ],
        openGraph: {
            title,
            description,
            url,
            siteName: "De Nouveau",
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            locale,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [imageUrl],
        },
    };
}
