import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import DesktopNav from "@/components/navigation/DesktopNav";
import { getNavProjects, getAgencyInfo } from "@/lib/payload/fetchers";
import MobileNav from "@/components/navigation/MobileNav";
import SiteFooter from "@/components/SiteFooter";
import { staticPageSeo } from "@/library/seoContent";
import { createMetadata } from "@/library/seo";
import JsonLd from "@/components/seo/JsonLd";
import { createOrganizationStructuredData } from "@/library/structuredData";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = createMetadata({
    ...staticPageSeo.home,
    locale: "fr_FR",
});

const LOCALE: "fr" | "en" = "fr";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [navProjects, agencyInfo] = await Promise.all([
        getNavProjects(),
        getAgencyInfo(),
    ]);

    return (
        <html
            lang={LOCALE}
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">
                <JsonLd data={createOrganizationStructuredData(agencyInfo)} />
                <div className="hidden md:block">
                    <DesktopNav projects={navProjects} />
                </div>
                <div className="block md:hidden">
                    <MobileNav projects={navProjects} />
                </div>
                {children}
                <SiteFooter />
            </body>
        </html>
    );
}
