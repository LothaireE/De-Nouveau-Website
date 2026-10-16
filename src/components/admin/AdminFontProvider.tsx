"use client";

import { Roboto } from "next/font/google";
import type { CSSProperties, ReactNode } from "react";

// Same self-hosted typeface as the site; Payload reads --font-body everywhere.
const roboto = Roboto({ variable: "--font-roboto", subsets: ["latin"] });

const fontStyle = {
    display: "contents",
    "--font-body": "var(--font-roboto), sans-serif",
} as CSSProperties;

export function AdminFontProvider({ children }: { children: ReactNode }) {
    return (
        <div className={roboto.variable} style={fontStyle}>
            {children}
        </div>
    );
}
