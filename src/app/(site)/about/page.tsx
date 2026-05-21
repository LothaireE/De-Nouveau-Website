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

function AboutSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        // <section className="border-t border-studio-black/20 pt-8 col-span-1">
        <section className="pt-8 col-span-1">
            <p className="mb-8 text-xs uppercase tracking-wide text-studio-black/35">
                {title}
            </p>

            <div className="max-w-3xl text-[clamp(1.2rem,1.5vw,2rem)] leading-[1.05] tracking-[-0.04em]">
                {children}
            </div>
        </section>
    );
}

export default async function AboutPage() {
    const page = await getPage(SLUG);

    if (!page) notFound();

    const portrait =
        page.portrait && typeof page.portrait !== "number"
            ? page.portrait
            : null;

    return (
        <main className="min-h-screen bg-studio-cream text-studio-black">
            <div className="grid gap-10 md:grid-cols-5">
                <aside className="md:col-span-2">
                    {portrait ? (
                        <MediaImage
                            media={portrait}
                            fallbackAlt={page.title}
                            priority
                            size="large"
                            variant="half"
                            className="h-full w-full object-cover object-center "
                        />
                    ) : (
                        <div className="absolute inset-0 bg-studio-red-dark" />
                    )}
                </aside>

                <div className="md:col-span-3 grid md:grid-cols-2 md:min-h-screen py-32 md:gap-12">
                    <div className="md:col-span-3">
                        {page?.content && (
                            <AboutSection title="À propos">
                                <RichText data={page?.content} />
                            </AboutSection>
                        )}
                    </div>
                    <AboutSection title="Récompenses">
                        <ul className="space-y-3">
                            {page.awards?.map((award) => (
                                <li key={award.id}>{award.name}</li>
                            ))}
                        </ul>
                    </AboutSection>

                    <AboutSection title="Nos membres">
                        <ul className="space-y-3">
                            {page.studioTeam?.map((member) => (
                                <li key={member.id}>
                                    {member.name} - {member.role}.
                                </li>
                            ))}
                        </ul>
                    </AboutSection>
                </div>
            </div>
        </main>
    );
}
