"use client";

import { Roboto } from "next/font/google";
import { useEffect, type CSSProperties, type ReactNode } from "react";

// Same self-hosted typeface as the site.
const roboto = Roboto({ variable: "--font-roboto", subsets: ["latin"] });

// Applies to the admin tree on the first render, before the effect below runs.
const fontStyle = {
    display: "contents",
    "--font-body": "var(--font-roboto), sans-serif",
    fontFamily: "var(--font-body)",
} as CSSProperties;

export function AdminFontProvider({ children }: { children: ReactNode }) {
    // Modals and menus render outside this tree: expose the font on <html> too,
    // where custom.scss maps Payload's --font-body to it.
    useEffect(() => {
        document.documentElement.classList.add(roboto.variable);
    }, []);

    return (
        <div className={roboto.variable} style={fontStyle}>
            {children}
        </div>
    );
}
