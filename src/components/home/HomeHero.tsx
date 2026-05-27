"use client";

import MediaImage from "@/components/MediaImage";
import type { Page } from "@/payload-types";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import TITLE_IMAGE from "../../../public/DE_NOUVEAU/SVG/DE_NOUVEAU_WHITE_CROPPED.svg";
import { useRef } from "react";

export default function HomeHero({ content }: { content: Page | null }) {
    const sectionRef = useRef<HTMLElement | null>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"],
    });

    const logoY = useTransform(scrollYProgress, [0, 1], ["4%", "100%"]);

    if (!content) return null;

    const hasHeroVideo = Boolean(content.heroVideoUrl);
    const hasHeroImage =
        content.heroImage && typeof content.heroImage !== "number";

    return (
        <section
            ref={sectionRef}
            className="relative min-h-svh overflow-hidden px-4 sm:px-6"
        >
            <div className="absolute inset-0 h-full w-full">
                {hasHeroVideo ? (
                    <video
                        src={content.heroVideoUrl || ""}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="h-full w-full object-cover object-bottom"
                    />
                ) : hasHeroImage ? (
                    <MediaImage
                        media={content.heroImage}
                        size="hero"
                        fallbackAlt={content.title}
                        priority
                        variant="full"
                        // className="h-full w-full object-cover object-center"
                        className="h-full w-full object-cover object-bottom"
                    />
                ) : null}
            </div>

            <motion.div
                style={{ y: logoY }}
                className="relative z-10 flex min-h-svh items-center md:items-start md:pl-6 lg:pl-10"
            >
                <div className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl">
                    <Image
                        src={TITLE_IMAGE}
                        alt="De Nouveau, architecture et design"
                        className="h-auto w-full"
                        priority
                    />
                </div>
            </motion.div>
        </section>
    );
}
