"use client";

import MediaImage from "@/components/media/MediaImage";
import MediaVideo from "../media/MediaVideo";
import HeroNav from "@/components/navigation/HeroNav";
import type { Page } from "@/payload-types";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

const LOGO_SRC = "/DE_NOUVEAU/SVG/DE_NOUVEAU_RED_02.svg";

export default function HomeHero({ content }: { content: Page | null }) {
    const sectionRef = useRef<HTMLElement | null>(null);
    const logoTrackRef = useRef<HTMLDivElement | null>(null);
    const logoRef = useRef<HTMLDivElement | null>(null);
    // How far the logo may travel: it stops on the hero's bottom edge
    // instead of sliding under the next section.
    const maxLogoY = useRef(Number.POSITIVE_INFINITY);

    const { scrollY } = useScroll();
    const logoY = useTransform(scrollY, (value) =>
        Math.max(0, Math.min(value, maxLogoY.current)),
    );

    useEffect(() => {
        const section = sectionRef.current;
        const track = logoTrackRef.current;
        const logo = logoRef.current;
        if (!section || !track || !logo) return;

        const measure = () => {
            const logoBottom =
                track.offsetTop + logo.offsetTop + logo.offsetHeight;
            maxLogoY.current = section.offsetHeight - logoBottom;
        };

        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(section);
        observer.observe(logo);
        return () => observer.disconnect();
    }, []);

    if (!content) return null;

    const heroMedia =
        content.heroMedia && typeof content.heroMedia !== "number"
            ? content.heroMedia
            : null;
    const heroMediaType = heroMedia?.mediaType ?? null;
    const caption = heroMedia?.caption?.trim();

    return (
        <section
            ref={sectionRef}
            className="relative min-h-svh overflow-hidden px-4 sm:px-6"
        >
            <div className="absolute inset-0 h-full w-full">
                {heroMediaType === "video" ? (
                    <MediaVideo media={content.heroMedia} withCaption={false} />
                ) : heroMediaType === "image" ? (
                    <MediaImage
                        media={content.heroMedia}
                        size="hero"
                        fallbackAlt={content.title}
                        priority
                        variant="full"
                        wrapperClassName="relative h-full w-full"
                        className="h-full w-full object-cover object-bottom"
                        withCaption={false}
                    />
                ) : null}
            </div>

            {/* Keeps the white nav and caption readable on light photos. */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgb(5_5_5/0.5),transparent_42%),linear-gradient(to_bottom,rgb(5_5_5/0.35),transparent_26%)]"
            />

            <HeroNav />

            <motion.div
                ref={logoTrackRef}
                style={{ y: logoY }}
                className="relative z-10 flex min-h-svh items-center md:items-start md:pl-6 md:pt-12 lg:pl-10"
            >
                <div
                    ref={logoRef}
                    className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl"
                >
                    <Image
                        src={LOGO_SRC}
                        alt="De Nouveau, architecture et design"
                        className="h-auto w-full"
                        preload
                        width={120}
                        height={120}
                    />
                </div>
            </motion.div>

            {/* The photo's own caption from the admin, set discreetly. */}
            {caption && (
                <p className="absolute bottom-5 left-4 right-4 z-20 text-small text-studio-white/85 sm:left-6 md:bottom-8 lg:left-10">
                    {caption}
                </p>
            )}
        </section>
    );
}
