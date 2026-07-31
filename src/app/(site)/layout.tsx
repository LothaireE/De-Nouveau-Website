import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import DesktopNav from "@/components/navigation/DesktopNav";
import { getNavProjects } from "@/library/payload/fetchers";
import MobileNav from "@/components/navigation/MobileNav";
import { createMetadata } from "@/library/seo";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = createMetadata({
    title: "De Nouveau",
    description: "Studio d'architecture De Nouveau",
    path: "/",
    locale: "fr_FR",
});

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
                <div className="hidden md:block">
                    <DesktopNav projects={navProjects} />
                </div>
                <div className="block md:hidden">
                    <MobileNav projects={navProjects} />
                </div>
                {children}
            </body>
        </html>
    );
}
