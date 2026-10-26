import Image from "next/image";
import Link from "next/link";
import { legalNavItem } from "@/library/navItems";

const WORDMARK_SRC = "/DE_NOUVEAU/SVG/DE_NOUVEAU_BLACK_CROPPED.svg";

/** Site footer: the legal link on one line, then the full-width wordmark. */
export default function SiteFooter() {
    return (
        <footer className="mt-auto px-4 pb-7 pt-10 text-small text-studio-black sm:px-6 md:pt-18 lg:px-10">
            <div className="flex flex-wrap items-baseline justify-center gap-x-5 gap-y-1.5">
                <h2 className="text-label font-medium uppercase tracking-wide text-studio-black/60">
                    Informations
                </h2>
                <Link href={legalNavItem.href} className="fill-text">
                    {legalNavItem.label}
                </Link>
            </div>

            <Image
                src={WORDMARK_SRC}
                alt=""
                width={1472}
                height={193}
                className="mt-10 h-auto w-full md:mt-24"
            />
        </footer>
    );
}
