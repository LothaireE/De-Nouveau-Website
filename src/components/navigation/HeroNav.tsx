import Link from "next/link";
import { frNavItems } from "@/library/navItems";

/**
 * The three page links at the top of every page. Centred as a group on wide
 * screens; on phones they spread out, clear of the logo menu button.
 * `overlay` lays them in white over a full-bleed photo; `page` sets them in
 * black at the top of a page without one.
 */
export default function HeroNav({
    variant = "overlay",
}: {
    variant?: "overlay" | "page";
}) {
    const position =
        variant === "overlay" ? "absolute inset-x-0 top-0 z-20" : "relative";

    return (
        <nav
            aria-label="Pages"
            className={`${position} flex justify-between gap-4 px-4 pr-24 pt-4 text-small uppercase tracking-wide sm:px-6 sm:pr-24 md:justify-center md:gap-[min(22vw,25rem)] md:pr-6 md:pt-3.5`}
        >
            {frNavItems.map((navItem) => (
                <Link
                    key={navItem.href}
                    href={navItem.href}
                    className={`fill-text ${variant === "overlay" ? "fill-text-white" : ""}`}
                >
                    {navItem.label}
                </Link>
            ))}
        </nav>
    );
}
