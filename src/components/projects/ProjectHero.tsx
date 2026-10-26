import Image from "next/image";
import Link from "next/link";
import MediaImage from "@/components/media/MediaImage";
import HeroNav from "@/components/navigation/HeroNav";
import type { Project } from "@/payload-types";
import { getProjectMeta } from "@/library/projectDisplay";

const LOGO_SRC = "/DE_NOUVEAU/SVG/DE_NOUVEAU_WHITE.svg";

/** Full-bleed cover with the title set in the photo, bottom left. */
export default function ProjectHero({ project }: { project: Project }) {
    const meta = [...getProjectMeta(project), project.location].filter(
        (value): value is string => Boolean(value),
    );

    return (
        <section className="relative h-svh max-h-270 min-h-140 overflow-hidden bg-studio-black text-studio-white">
            <MediaImage
                media={project.coverImage}
                size="hero"
                variant="full"
                priority
                quality={95}
                withCaption={false}
                fallbackAlt={project.title}
                wrapperClassName="absolute inset-0"
                className="h-full w-full object-cover"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgb(5_5_5/0.5),transparent_42%),linear-gradient(to_bottom,rgb(5_5_5/0.35),transparent_26%)]"
            />

            <HeroNav />

            <Link
                href="/"
                aria-label="De Nouveau, accueil"
                className="absolute left-4 top-14 z-20 sm:left-6 lg:left-10"
            >
                <Image
                    src={LOGO_SRC}
                    alt=""
                    width={1615}
                    height={394}
                    className="h-10 w-auto md:h-16"
                />
            </Link>

            <div className="absolute bottom-7 left-4 right-4 z-10 sm:left-6 md:bottom-14 lg:left-10">
                <h1 className="pr-[0.12em] text-lead font-bold uppercase italic">
                    {project.title}
                </h1>
                {meta.length > 0 && (
                    <p className="mt-1 flex flex-wrap gap-x-5 text-body font-light">
                        {meta.map((item) => (
                            <span key={item}>{item}</span>
                        ))}
                    </p>
                )}
            </div>
        </section>
    );
}
