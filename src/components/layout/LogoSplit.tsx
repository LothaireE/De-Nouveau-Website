import Image from "next/image";
import Link from "next/link";

const LOGO_SRC = "/DE_NOUVEAU/SVG/DE_NOUVEAU_RED_01_CROPPED.svg";

/**
 * Opening block of the text pages, after the MEP footer: the large logo in
 * the left half, the content in the right half (`side`) or under the logo
 * (`below`). Spacing is in `em`, so it follows the text size set through
 * `className`. `fillScreen` centres the block in the first screen, which
 * keeps the footer below the fold.
 */
export default function LogoSplit({
    children,
    layout = "side",
    fillScreen = false,
    className = "",
}: {
    children: React.ReactNode;
    layout?: "side" | "below";
    fillScreen?: boolean;
    className?: string;
}) {
    return (
        <section
            className={`grid grid-cols-1 items-start gap-x-6 px-4 py-[3em] sm:px-6 md:grid-cols-12 lg:px-10 ${
                fillScreen ? "min-h-[calc(100svh-3.5rem)] content-center" : ""
            } ${className}`}
        >
            <Link
                href="/"
                aria-label="De Nouveau, accueil"
                // The cropped logo starts at its letters, so a small offset
                // lines its top up with the first line of text beside it.
                className={`mb-[1.2em] block md:col-span-6 ${
                    layout === "side" ? "md:mb-0 md:pt-[0.2em]" : ""
                }`}
            >
                <Image
                    src={LOGO_SRC}
                    alt=""
                    width={1177}
                    height={168}
                    className="h-auto w-[90%]"
                />
            </Link>
            <div
                className={`min-w-0 ${
                    layout === "side" ? "md:col-span-6" : "md:col-span-12"
                }`}
            >
                {children}
            </div>
        </section>
    );
}
