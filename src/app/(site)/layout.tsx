import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "../globals.css";
import DesktopNav from "@/components/navigation/DesktopNav";
import { getNavProjects, getAgencyInfo } from "@/lib/payload/fetchers";
import MobileNav from "@/components/navigation/MobileNav";
import SiteFooter from "@/components/SiteFooter";
import { staticPageSeo } from "@/library/seoContent";
import { createMetadata } from "@/library/seo";
import JsonLd from "@/components/seo/JsonLd";
import { createOrganizationStructuredData } from "@/library/structuredData";

// Same typeface as the "Architecture et design" signature of the logo.
const roboto = Roboto({
    variable: "--font-roboto",
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
        <html lang={LOCALE} className={`${roboto.variable} h-full antialiased`}>
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
