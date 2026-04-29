import type { Metadata } from "next";

const siteUrl = "https://www.de-nouveau.com"; // insh';

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
    image = "/images/og-default.jpg",
}: SeoParams): Metadata {
    const isFrench = locale === "fr_FR";

    return {
        title,
        description,
        alternates: {
            canonical: `${siteUrl}${path}`,
            languages: {
                "fr-FR": `${siteUrl}${isFrench ? path : path.replace("/en", "")}`,
                "en-US": `${siteUrl}${isFrench ? `/en${path}` : path}`,
            },
        },
        keywords: [
            "architecture",
            "design",
            "studio",
            "projects",
            "about",
            "contact",
        ],
        openGraph: {
            title,
            description,
            url: `${siteUrl}${path}`,
            siteName: "De Nouveau",
            images: [
                {
                    url: `${siteUrl}${image}`,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            locale,
            type: "website",
        },
    };
}
