import type { Metadata } from "next";

export const SITE_URL = "https://www.denouveau.fr";
export const DEFAULT_OG_IMAGE = "/DE_NOUVEAU/PNG/og-default-de-nouveau.png";

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
    image = DEFAULT_OG_IMAGE,
}: SeoParams): Metadata {
    const url = new URL(path, SITE_URL).toString();
    const imageUrl = image.startsWith("http")
        ? image
        : new URL(image, SITE_URL).toString();

    return {
        title,
        description,
        icons: {
            icon: "/icon.png",
            shortcut: "/icon.png",
            apple: "/icon.png",
        },
        metadataBase: new URL(SITE_URL),
        authors: [{ name: "De Nouveau", url: SITE_URL }],
        alternates: {
            canonical: url,
            languages: {
                "fr-FR": url,
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
