import { createMetadata } from "@/library/seo";
import { getPage } from "@/library/payload/fetchers";
import Link from "next/link";
import { notFound } from "next/navigation";
// import { PortableText } from "@portabletext/react";

export const metadata = createMetadata({
    title: "Contacter De Nouveau",
    description: "Ceci est la page contact de De Nouveau",
    path: "/about",
    locale: "fr_FR",
    image: "https://www.de-nouveau.com/images/contact.jpg",
});

const SLUG = "contact";

export default async function ContactPage() {
    const page = await getPage(SLUG);

    if (!page) notFound();

    return (
        <main className="min-h-[calc(100vh-80px)] px-6 py-16">
            <section className="grid min-h-[70vh] grid-cols-1 gap-16 md:grid-cols-2">
                <div>
                    <h1 className="text-5xl font-medium md:text-7xl">
                        {page.title}
                    </h1>
                </div>

                <div className="flex flex-col justify-end gap-10">
                    {page.content && (
                        <div className="max-w-md text-base leading-relaxed text-neutral-700">
                            {/* <PortableText value={page.content} /> */}{" "}
                            page.content ici
                        </div>
                    )}

                    <div className="space-y-3 text-lg">
                        {page.email && (
                            <p>
                                <Link
                                    href={`mailto:${page.email}`}
                                    className="underline-offset-4 hover:underline"
                                >
                                    {page.email}
                                </Link>
                            </p>
                        )}

                        {page.phone && (
                            <p>
                                <Link
                                    href={`tel:${page.phone.replace(/\s/g, "")}`}
                                    className="underline-offset-4 hover:underline"
                                >
                                    {page.phone}
                                </Link>
                            </p>
                        )}

                        {page.address && (
                            <p className="max-w-sm whitespace-pre-line text-neutral-600">
                                {page.address}
                            </p>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}
