import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import FloatingNav from "@/components/navigation/FloatingNav";
import { getNavProjects } from "@/library/payload/fetchers";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    // this is the default metadata for all pages, I can override it in each page.tsx if needed
    title: "De Nouveau",
    description: "Studio d'architecture De Nouveau ",
    keywords: [
        "architecture",
        "design",
        "studio",
        "projects",
        "about",
        "contact",
    ],
    authors: [{ name: "Jean", url: "https://www.de-nouveau.com" }],
    openGraph: {
        title: "De Nouveau",
        description: "Studio d'architecture De Nouveau ",
        url: "https://www.de-nouveau.com",
        siteName: "De Nouveau",
        images: [
            {
                url: "https://www.de-nouveau.com/images/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "De Nouveau Studio d'Architecture",
            },
        ],
        locale: "fr_FR",
        type: "website",
    },
};

const LOCALE: "fr" | "en" = "fr";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const navProjects = await getNavProjects();

    return (
        <html
            lang={LOCALE}
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">
                <FloatingNav projects={navProjects} />
                {children}
            </body>
        </html>
    );
}
