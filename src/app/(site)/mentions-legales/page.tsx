import Link from "next/link";
import { getAgencyInfo } from "@/lib/payload/fetchers";
import { createMetadata } from "@/library/seo";
import { staticPageSeo } from "@/library/seoContent";
import { getLegalNoticeSections } from "@/library/legalNotice";

export const metadata = createMetadata({
    ...staticPageSeo.legal,
    locale: "fr_FR",
});

export default async function LegalNoticePage() {
    const sections = getLegalNoticeSections(await getAgencyInfo());

    return (
        <main className="min-h-screen bg-studio-white px-5 pb-24 pt-32 text-studio-black md:px-12">
            <h1 className="mb-16 text-heading font-medium">Mentions légales</h1>

            <div className="grid max-w-5xl gap-12 md:grid-cols-2">
                {sections.map((section) => (
                    <section key={section.title}>
                        <h2 className="mb-4 text-label uppercase tracking-wide text-studio-black/60">
                            {section.title}
                        </h2>
                        <dl className="space-y-3 text-small">
                            {section.items.map((item) => (
                                <div key={item.label}>
                                    <dt className="text-studio-black/60">
                                        {item.label}
                                    </dt>
                                    <dd className="whitespace-pre-line wrap-anywhere">
                                        {item.href ? (
                                            <Link
                                                href={item.href}
                                                className="transition hover:text-studio-red-muted"
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
        </main>
    );
}
