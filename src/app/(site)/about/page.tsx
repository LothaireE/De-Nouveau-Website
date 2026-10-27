import { getPage } from "@/lib/payload/fetchers";
import { getPageMetadata } from "@/lib/payload/metadata";
import { notFound } from "next/navigation";
import { RichText } from "@payloadcms/richtext-lexical/react";
import MediaImage from "@/components/media/MediaImage";
import LogoSplit from "@/components/layout/LogoSplit";
import HeroNav from "@/components/navigation/HeroNav";

export async function generateMetadata() {
    return getPageMetadata(SLUG);
}

const SLUG = "about";

/** A heading over unruled two-column rows: label on the left, name on the right. */
function AboutList({
    title,
    rows,
}: {
    title: string;
    rows: { key: string; label: string; value: string }[];
}) {
    return (
        <section className="px-4 pb-12 sm:px-6 md:pb-16 lg:px-10">
            <h2 className="mb-3.5 text-label font-medium uppercase tracking-wide text-studio-black/60">
                {title}
            </h2>
            <dl>
                {rows.map((row) => (
                    <div
                        key={row.key}
                        className="grid grid-cols-1 items-baseline gap-x-6 py-1.5 md:grid-cols-12"
                    >
                        <dt className="text-label uppercase tracking-wide text-studio-black/60 md:col-span-3">
                            {row.label}
                        </dt>
                        <dd className="text-lead wrap-anywhere md:col-span-9">
                            {row.value}
                        </dd>
                    </div>
                ))}
            </dl>
        </section>
    );
}

export default async function AboutPage() {
    const page = await getPage(SLUG);

    if (!page) return notFound();

    // A photo band between the text and the lists: the main media, else the portrait.
    const band = [page.heroMedia, page.portrait].find(
        (media) =>
            media && typeof media !== "number" && media.mediaType !== "video",
    );

    const team = (page.studioTeam ?? []).flatMap((member, index) =>
        member.name
            ? [
                  {
                      key: member.id ?? String(index),
                      label: member.role ?? "",
                      value: member.name,
                  },
              ]
            : [],
    );
    const awards = (page.awards ?? []).flatMap((award, index) =>
        award.name
            ? [
                  {
                      key: award.id ?? String(index),
                      label: award.year ?? "",
                      value: award.name,
                  },
              ]
            : [],
    );

    return (
        <main className="bg-studio-white text-studio-black">
            <HeroNav variant="page" />

            <LogoSplit layout="below" className="text-heading">
                <h1 className="sr-only">{page.title?.trim() || "À propos"}</h1>
                {page.content && (
                    <div className="space-y-[0.6em]">
                        <RichText data={page.content} />
                    </div>
                )}
            </LogoSplit>

            {band && (
                <figure className="relative mb-12 aspect-4/5 overflow-hidden bg-studio-cream md:mb-16 md:aspect-16/7">
                    <MediaImage
                        media={band}
                        size="hero"
                        variant="full"
                        withCaption={false}
                        fallbackAlt={page.title}
                        wrapperClassName="absolute inset-0"
                        className="h-full w-full object-cover"
                    />
                </figure>
            )}

            {team.length > 0 && <AboutList title="Équipe" rows={team} />}
            {awards.length > 0 && (
                <AboutList title="Récompenses" rows={awards} />
            )}
        </main>
    );
}
