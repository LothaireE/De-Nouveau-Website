import { getPage } from "@/library/payload/fetchers";
import { createMetadata } from "@/library/seo";
import { notFound } from "next/navigation";
import { RichText } from "@payloadcms/richtext-lexical/react";
import MediaImage from "@/components/MediaImage";

export const metadata = createMetadata({
    title: "À propos — De Nouveau",
    description:
        "Découvrez De Nouveau, son approche, ses projets et sa vision architecturale.",
    path: "/about",
    locale: "fr_FR",
    image: "/images/about.jpg",
});

const SLUG = "about";

export default async function AboutPage() {
    const about = await getPage(SLUG);

    if (!about) notFound();

    const portrait =
        about.portrait && typeof about.portrait !== "number"
            ? about.portrait
            : null;

    return (
        <main className="px-6 py-16">
            <section className="grid min-h-[70vh] grid-cols-1 gap-16 md:grid-cols-2">
                <div>
                    <h1 className="max-w-4xl text-5xl font-medium md:text-7xl">
                        {about.title}
                    </h1>
                </div>

                <div className="flex flex-col gap-12">
                    {portrait && (
                        <MediaImage
                            media={portrait}
                            size="large"
                            fallbackAlt={about.title}
                            priority={true}
                            className="h-auto w-full object-cover"
                        />
                    )}

                    {about.intro && (
                        <p className="max-w-xl text-xl leading-relaxed">
                            {about.intro}
                        </p>
                    )}

                    {about.content && (
                        <div className="prose prose-neutral max-w-xl">
                            <RichText data={about.content} />
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
