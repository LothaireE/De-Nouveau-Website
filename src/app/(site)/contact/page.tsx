import { createMetadata } from "@/library/seo";
import { getPage } from "@/library/payload/fetchers";
import Link from "next/link";
import { notFound } from "next/navigation";
import MediaImage from "@/components/MediaImage";

export const metadata = createMetadata({
    title: "Contacter De Nouveau",
    description: "Ceci est la page contact de De Nouveau",
    path: "/contact",
    locale: "fr_FR",
    image: "https://www.de-nouveau.com/images/contact.jpg",
});

const SLUG = "contact";

function ContactBlock({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <p className="mb-3 text-xs text-studio-black/35">{title}</p>
            <div className="flex  flex-col gap-1 text-[clamp(1.4rem,2vw,2.4rem)] leading-[1.05] tracking-[-0.04em]">
                {children}
            </div>
        </div>
    );
}

export default async function ContactPage() {
    const page = await getPage(SLUG);

    if (!page) notFound();

    const imageSrc = !page.portrait || typeof page.portrait !== "number";

    return (
        <main className="min-h-screen bg-studio-cream text-studio-black">
            <section className="grid min-h-screen grid-cols-1 md:grid-cols-5">
                <div className="flex  min-h-screen flex-col justify-center px-6 pb-16 pt-32 md:px-12 md:pb-24 md:col-span-3">
                    <div className=" grid ">
                        <div className="grid  gap-10 text-sm md:justify-center">
                            <div className="space-y-10">
                                <ContactBlock title="Contact">
                                    {page.email && (
                                        <Link
                                            href={`mailto:${page.email}`}
                                            className="transition hover:text-studio-red"
                                        >
                                            {page.email}
                                        </Link>
                                    )}

                                    {page.phone && (
                                        <Link
                                            href={`tel:${page.phone.replace(/\s/g, "")}`}
                                            className="transition hover:text-studio-red"
                                        >
                                            {page.phone}
                                        </Link>
                                    )}
                                </ContactBlock>

                                {page.address && (
                                    <ContactBlock title="Adresse">
                                        <span className="whitespace-pre-line">
                                            {page.address}
                                        </span>
                                    </ContactBlock>
                                )}
                            </div>

                            <div className="space-y-10">
                                <ContactBlock title="Follow us">
                                    <div className="flex gap-4">
                                        {page.socialMedias?.map(
                                            (socialMedia) => (
                                                <a
                                                    key={socialMedia.id}
                                                    target="_blank"
                                                    href={
                                                        socialMedia.link ?? ""
                                                    }
                                                    rel="noopener noreferrer"
                                                    className="transition hover:text-studio-red"
                                                >
                                                    {socialMedia.label}
                                                </a>
                                            ),
                                        )}
                                    </div>
                                </ContactBlock>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative hidden min-h-screen bg-studio-red-dark md:block md:col-span-2">
                    {imageSrc ? (
                        <MediaImage
                            media={page.portrait}
                            fallbackAlt={page.title}
                            priority
                            size="large"
                            variant="half"
                            className="h-full w-full object-cover object-center"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-studio-red-dark" />
                    )}

                    <div className="absolute inset-0 bg-studio-black/10" />
                </div>
            </section>
        </main>
    );
}
