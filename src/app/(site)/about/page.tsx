import { getPage } from "@/library/sanity/fetchers";
import { createMetadata } from "@/library/seo";
import { PortableText } from "@portabletext/react";
import { notFound } from "next/navigation";

export const metadata = createMetadata({
    title: "À propos — De Nouveau",
    description:
        "Découvrez De Nouveau, son approche, ses projets et sa vision architecturale.",
    path: "/about",
    locale: "fr_FR",
    image: "/images/about.jpg",
});

/**
 * TODO
Contenu :
- présentation de l’agence;
- philosophie ;
- portrait ou image studio ;
- références, prix, publications si desiré ;
 */

const SLUG = "about";

export default async function AboutPage() {
    const about = await getPage(SLUG);

    if (!about) notFound();

    return (
        <div>
            <h2 className="text-3xl font-bold mb-4">{about?.title}</h2>
            <p>{about?.intro}</p>
            {about.content && <PortableText value={about.content} />}
        </div>
    );
}
