import Link from "next/link";
import { getAgencyInfo } from "@/lib/payload/fetchers";
import { createMetadata } from "@/library/seo";
import { staticPageSeo } from "@/library/seoContent";
import { getLegalNoticeSections } from "@/library/legalNotice";
import LogoSplit from "@/components/layout/LogoSplit";
import HeroNav from "@/components/navigation/HeroNav";

export const metadata = createMetadata({
    ...staticPageSeo.legal,
    locale: "fr_FR",
});

export default async function LegalNoticePage() {
    const sections = getLegalNoticeSections(await getAgencyInfo());

    return (
        <main className="bg-studio-white text-studio-black">
            <HeroNav variant="page" />

            {/* The Contact layout, with reading-size text for longer lines. */}
            <LogoSplit fillScreen className="text-body">
                <h1 className="sr-only">Mentions légales</h1>

                <div className="flex flex-col gap-[2.2em]">
                    {sections.map((section) => (
                        <section key={section.title}>
                            <h2 className="mb-2.5 text-label font-medium uppercase tracking-wide text-studio-black/60">
                                {section.title}
                            </h2>
                            <dl className="space-y-3.5">
                                {section.items.map((item) => (
                                    <div key={item.label}>
                                        <dt className="text-label text-studio-black/60">
                                            {item.label}
                                        </dt>
                                        <dd className="whitespace-pre-line wrap-anywhere">
                                            {item.href ? (
                                                <Link
                                                    href={item.href}
                                                    className="fill-text"
                                                >
                                                    {item.value}
                                                </Link>
                                            ) : (
                                                item.value
                                            )}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </section>
                    ))}
                </div>
            </LogoSplit>
        </main>
    );
}
