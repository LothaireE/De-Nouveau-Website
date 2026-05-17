"use client";

import MediaImage from "@/components/MediaImage";
import type { Page } from "@/payload-types";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import TITLE_IMAGE from "../../../public/DE_NOUVEAU/SVG/DE_NOUVEAU_BLACK_CROPPED.svg";
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
            className="relative h-screen overflow-hidden px-4 sm:px-6"
        >
            <div className="absolute inset-0">
                {hasHeroVideo ? (
                    <video
                        src={content.heroVideoUrl || ""}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="h-full w-full object-cover"
                    />
                ) : hasHeroImage ? (
                    <MediaImage
                        media={content.heroImage}
                        size="hero"
                        fallbackAlt={content.title}
                        priority
                        className="h-full w-full object-cover"
                    />
                ) : null}
            </div>

            <motion.div
                style={{ y: logoY }}
                // className="relative z-10 flex h-screen items-start  md:pl-12 lg:pl-20"
                className="relative z-10 flex h-screen items-start  md:pl-6 lg:pl-10"
            >
                <div className=" w-full max-w-xl p- md:max-w-2xl lg:max-w-3xl">
                    <Image
                        src={TITLE_IMAGE}
                        alt="De Nouveau, architecture et design"
                        className="h-auto w-full "
                        priority
                    />
                </div>
            </motion.div>
        </section>
    );
}
