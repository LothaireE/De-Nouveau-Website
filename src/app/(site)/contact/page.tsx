import { getPageMetadata } from "@/lib/payload/metadata";
import { getPage } from "@/lib/payload/fetchers";
import Link from "next/link";
import { notFound } from "next/navigation";
import LogoSplit from "@/components/layout/LogoSplit";
import HeroNav from "@/components/navigation/HeroNav";

export async function generateMetadata() {
    return getPageMetadata(SLUG);
}

const SLUG = "contact";

export default async function ContactPage() {
    const page = await getPage(SLUG);

    if (!page) return notFound();

    const socials = (page.socialMedias ?? []).filter((item) => item.link);
    const hasDetails = Boolean(page.address || page.phone || page.email);

    return (
        <main className="bg-studio-white text-studio-black">
            <HeroNav variant="page" />

            <LogoSplit fillScreen className="text-statement font-medium">
                <h1 className="sr-only">{page.title?.trim() || "Contact"}</h1>

                {/* Two groups, as on the MEP footer: details, then social links. */}
                <div className="flex flex-col gap-[2.2em]">
                    {hasDetails && (
                        <address className="flex flex-col items-start not-italic">
                            {page.address && (
                                <span className="whitespace-pre-line wrap-anywhere">
                                    {page.address}
                                </span>
                            )}
                            {page.phone && (
                                <Link
                                    href={`tel:${page.phone.replace(/\s/g, "")}`}
                                    className="fill-text"
                                >
                                    {page.phone}
                                </Link>
                            )}
                            {page.email && (
                                <Link
                                    href={`mailto:${page.email}`}
                                    className="fill-text wrap-anywhere"
                                >
                                    {page.email}
                                </Link>
                            )}
                        </address>
                    )}

                    {socials.length > 0 && (
                        <ul
                            aria-label="Réseaux sociaux"
                            className="flex flex-col items-start"
                        >
                            {socials.map((socialMedia) => (
                                <li key={socialMedia.id ?? socialMedia.link}>
                                    <a
                                        href={socialMedia.link ?? ""}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="fill-text capitalize"
                                    >
                                        {socialMedia.label?.trim() ||
                                            socialMedia.link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </LogoSplit>
        </main>
    );
}
