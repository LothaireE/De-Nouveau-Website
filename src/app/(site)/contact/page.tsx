import { createMetadata } from "@/library/seo";
import { getPage } from "@/library/payload/fetchers";
import Link from "next/link";
import { notFound } from "next/navigation";
import MediaImage from "@/components/media/MediaImage";

export const metadata = createMetadata({
    title: "Contacter De Nouveau",
    description: "Bienvenue sur la page contact de De Nouveau",
    path: "/contact",
    locale: "fr_FR",
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
            <div className="flex flex-col gap-2">{children}</div>
        </div>
    );
}

export default async function ContactPage() {
    const page = await getPage(SLUG);

    if (!page) return notFound();

    const imageSrc = !page.portrait || typeof page.portrait !== "number";

    return (
        <main className="min-h-screen bg-studio-cream text-studio-black">
            <section className="grid min-h-screen grid-cols-1 md:grid-cols-5">
                <div className="flex min-h-screen flex-col justify-center px-6 pb-16 pt-32 md:px-12 md:pb-24 md:col-span-3">
                    <div className=" grid ">
                        {/* <div className="grid gap-16 md:gap-24"> */}
                        <div className="grid  gap-10 text-sm md:justify-center">
                            <div className="space-y-10">
                                <ContactBlock title="Contact">
                                    {page.email && (
                                        <Link
                                            href={`mailto:${page.email}`}
                                            className="transition hover:text-studio-red font-medium leading-none tracking-tighter text-4xl" //tracking-tighter
                                        >
                                            {page.email}
                                        </Link>
                                    )}

                                    {page.phone && (
                                        <Link
                                            href={`tel:${page.phone.replace(/\s/g, "")}`}
                                            className="transition hover:text-studio-red text-4xl font-medium leading-none tracking-tighter" //tracking-tighter
                                        >
                                            {page.phone}
                                        </Link>
                                    )}
                                </ContactBlock>

                                {page.address && page.address.length > 0 && (
                                    <ContactBlock title="Adresse">
                                        <span className="whitespace-pre-line text-4xl font-medium leading-none tracking-tighter">
                                            {page.address}
                                        </span>
                                    </ContactBlock>
                                )}
                            </div>

                            {page.socialMedias &&
                                page.socialMedias.length > 0 && (
                                    <div className="space-y-10">
                                        <ContactBlock title="Nous suivre">
                                            <div className="flex gap-4">
                                                {page.socialMedias?.map(
                                                    (socialMedia) => (
                                                        <a
                                                            key={socialMedia.id}
                                                            target="_blank"
                                                            href={
                                                                socialMedia.link ??
                                                                ""
                                                            }
                                                            rel="noopener noreferrer"
                                                            className="transition hover:text-studio-red text-4xl font-medium leading-none tracking-tighter"
                                                        >
                                                            {socialMedia.label}
                                                        </a>
                                                    ),
                                                )}
                                            </div>
                                        </ContactBlock>
                                    </div>
                                )}
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
